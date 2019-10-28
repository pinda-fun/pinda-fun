import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CommContext from 'components/room/comm/CommContext';
import { CommAttributes } from 'components/room/comm/Comm';
import UsernameForm from 'components/common/forms/UsernameForm';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';

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

const CreateRoomPage: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => {
  const comm = useContext(CommContext);
  const { error } = commHooks;
  const [selectedGame] = useState('shake');

  const attemptCreation = (name: string) => {
    comm.createRoom(name, selectedGame);
    // No need for cleanup - if the room creation is successful, redirect to the
    // HostRoom page. Cleanup/room leave to be executed on room cancellation.
    // See `CreateRoom`.
  };

  // TODO: stylise error
  if (error !== null) {
    return <p>Error: {error.toString()}</p>;
  }

  return (
    <CreateRoomContainer>
      <PindaHappySVG />
      <UsernameForm
        onSubmitName={attemptCreation}
      />
      <Link to={{ pathname: '/' }}>Cancel</Link>
    </CreateRoomContainer>
  );
};

export default CreateRoomPage;
