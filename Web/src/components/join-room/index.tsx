import React, { useState, useEffect, useContext } from 'react';
import { match, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'components/common/Modal';
import { MotionPermission } from 'components/games/GameStates';
import useCommHooks from 'components/room/comm/useCommHooks';
import CommContext from 'components/room/comm/CommContext';
import JoinRoomForm from './JoinRoomForm';
import { ReactComponent as PindaHeadSVG } from '../../svg/pinda-head-happy.svg';

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
    font-family: var(--primary);
    font-size: 1.4rem;
    font-weight: normal;
  }
`;

const PindaHead = styled(PindaHeadSVG)`
  height: 5.5rem;
`;

interface JoinRoomProps {
  match: match<{ id?: string }>;
}

const JoinRoomPage: React.FC<JoinRoomProps> = ({
  match: {
    params: { id },
  },
}) => {
  const [gamePin, setGamePin] = useState(id ? id.substring(0, PIN_LENGTH) : '');
  const [username, setUsername] = useState('');

  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const [showPermissionDialog, setPermissionDialog] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);

  const comm = useContext(CommContext);
  const {
    room, error,
  } = useCommHooks(comm);
  const history = useHistory();

  const getUserPermission = async function requestPermission() {
    try {
      const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
      if (permissionResult === 'granted') {
        setPermission(MotionPermission.GRANTED);
      } else {
        setPermission(MotionPermission.DENIED);
      }
    } catch (e) {
      setPermission(MotionPermission.DENIED);
    } finally {
      setPermissionDialog(false);
    }
  };

  const getPermissionAvailability = () => {
    if (!window.DeviceMotionEvent) {
      setPermission(MotionPermission.DENIED);
      return;
    }
    if (
      typeof (window.DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      setPermissionDialog(true);
    } else {
      setPermission(MotionPermission.GRANTED);
    }
  };

  const onJoinRoomFormSubmit = (newGamePin: string, newUsername: string) => {
    if (joinRequested) return;
    if (newGamePin.length !== PIN_LENGTH) return;
    if (newUsername === '') return;

    // Reset state
    setGamePin(newGamePin);
    setUsername(newUsername);
    setJoinRequested(true);
  };

  useEffect(() => {
    if (joinRequested && permission === MotionPermission.NOT_SET) {
      getPermissionAvailability();
    }
    if (joinRequested && permission === MotionPermission.GRANTED) {
      comm.joinRoom(gamePin, username);
    }
  }, [permission, joinRequested, gamePin, username, comm]);

  useEffect(() => {
    if (error !== null) setJoinRequested(false);
  }, [error]);

  useEffect(() => {
    if (room === null) return;
    history.push('/participant-room');
  }, [room, history]);

  return (
    <JoinRoomContainer>
      <PindaHead />
      <JoinRoomForm
        submitJoinRoomForm={onJoinRoomFormSubmit}
        initialId={id}
        pinLength={PIN_LENGTH}
        permission={permission}
      />
      <Modal
        isVisible={showPermissionDialog}
        title="Give Permissions?"
        onConfirm={getUserPermission}
        confirmationButtonText="Sure!"
      >
        Pinda requires some device permissions in order to play some games.
      </Modal>
    </JoinRoomContainer>
  );
};

export default JoinRoomPage;
