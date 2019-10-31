import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CommContext from 'components/room/comm/CommContext';
import { CommAttributes } from 'components/room/comm/Comm';
import UsernameForm from 'components/common/forms/UsernameForm';
import useMotionPermissionsAccess from 'components/room/hooks/permission/useMotionPermissionsAccess';
import { MotionPermission } from 'components/games/GameStates';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';
import PermissionsDialog from '../room/PermissionsDialog';

const CreateRoomContainer = styled.div`
  background: var(--pale-yellow);
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > * {
    margin: 0.5rem 0;
  }

  h1 {
    font-family: var(--primary);
    font-size: 1.4rem;
    font-weight: normal;
  }

  h2 {
    font-family: var(--primary-font);
    margin: 0.5rem 0;
    font-weight: normal;
    font-size: 1.3rem;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

const CreateRoomPage: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => {
  const comm = useContext(CommContext);
  const { error } = commHooks;
  const [selectedGame] = useState('shake');
  const [createRequested, setCreateRequested] = useState(false);
  const [hostName, setHostName] = useState('');

  const {
    permission, awaitingPermission, getUserPermission, getPermissionAvailability,
  } = useMotionPermissionsAccess();

  const onFormSubmit = (name: string) => {
    if (createRequested) return;
    if (!name.trim().length) return;
    setHostName(name);
    setCreateRequested(true);
    // No need for cleanup - if the room creation is successful, redirect to the
    // HostRoom page. Cleanup/room leave to be executed on room cancellation.
    // See `CreateRoom`.
  };

  useEffect(
    () => {
      if (createRequested && permission === MotionPermission.NOT_SET) {
        getPermissionAvailability();
      }
      if (createRequested && permission === MotionPermission.GRANTED) {
        comm.createRoom(hostName, selectedGame);
      }
    },
    [permission, createRequested, hostName, selectedGame, comm, getPermissionAvailability],
  );

  // TODO: stylise error
  if (error !== null) {
    return <p>Error: {error.toString()}</p>;
  }

  return (
    <CreateRoomContainer>
      <PindaHappySVG />
      <UsernameForm
        onSubmitName={onFormSubmit}
        disabled={permission === MotionPermission.DENIED}
      />
      <PermissionsDialog
        isVisible={awaitingPermission}
        onConfirm={getUserPermission}
      />
      <Link to={{ pathname: '/' }}>Cancel</Link>
      {permission === MotionPermission.DENIED
        && (
          <ErrorText>
            Unable to get permissions to play Pinda.
          </ErrorText>
        )}
    </CreateRoomContainer>
  );
};

export default CreateRoomPage;
