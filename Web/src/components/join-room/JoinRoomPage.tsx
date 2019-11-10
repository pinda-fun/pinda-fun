import React, { useState, useEffect, useContext } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components/macro';
import { MotionPermission } from 'components/games/GameStates';
import CommContext from 'components/room/comm/CommContext';
import { CommAttributes } from 'components/room/comm/Comm';
import JoinRoomForm from './JoinRoomForm';
import { ReactComponent as PindaHeadSVG } from '../../svg/pinda-head-happy.svg';
import useMotionPermissionsAccess from '../room/hooks/permission';
import PermissionsDialog from '../room/PermissionsDialog';
import ErrorDisplay from '../room/ErrorDisplay';

const PIN_LENGTH = 4;

const JoinRoomContainer = styled.div`
  background: var(--pale-purple);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    font-family: var(--primary-font);
    font-size: 1.4rem;
    font-weight: normal;
  }
`;

const PindaHead = styled(PindaHeadSVG)`
  height: 5.5rem;
`;

interface JoinRoomPageProps {
  roomId?: string;
  commHooks: CommAttributes;
}

const JoinRoomPage: React.FC<JoinRoomPageProps> = ({
  roomId, commHooks,
}) => {
  const [gamePin, setGamePin] = useState(roomId ? roomId.substring(0, PIN_LENGTH) : '');
  const [username, setUsername] = useState('');
  const [waitingForResponse, setWaitForResponse] = useState(false);

  const {
    permission, awaitingPermission, getUserPermission, getPermissionAvailability,
  } = useMotionPermissionsAccess();
  const [joinRequested, setJoinRequested] = useState(false);

  const comm = useContext(CommContext);
  const { room, error, errorDescription } = commHooks;

  const onJoinRoomFormSubmit = (newGamePin: string, newUsername: string) => {
    if (joinRequested) return;
    if (newGamePin.length !== PIN_LENGTH) return;
    if (!newUsername.trim().length) return;

    // Reset state
    setGamePin(newGamePin);
    setUsername(newUsername);
    setJoinRequested(true);
  };

  useEffect(
    () => {
      if (joinRequested && permission === MotionPermission.NOT_SET) {
        getPermissionAvailability();
      }
      if (joinRequested && permission === MotionPermission.GRANTED) {
        comm.joinRoom(gamePin, username);
        setWaitForResponse(true);
      }
    },
    [permission, joinRequested, gamePin, username, comm, getPermissionAvailability],
  );

  useEffect(
    () => {
      if (waitingForResponse && (error !== null || room !== null)) {
        setWaitForResponse(false);
        setJoinRequested(false);
      }
    },
    [error, room, waitingForResponse],
  );

  return (
    <JoinRoomContainer>
      <PindaHead />
      <JoinRoomForm
        submitJoinRoomForm={onJoinRoomFormSubmit}
        initialId={roomId}
        pinLength={PIN_LENGTH}
        permission={permission}
      />
      <PermissionsDialog
        isVisible={awaitingPermission}
        onConfirm={getUserPermission}
      />
      {waitingForResponse
        && (
          <ReactLoading
            type="bubbles"
            color="var(--green)"
          />
        )}
      <ErrorDisplay
        error={error}
        errorDescription={errorDescription}
      />
    </JoinRoomContainer>
  );
};

export default JoinRoomPage;
