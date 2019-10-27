import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import BigButton from 'components/common/BigButton';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
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

  h2 {
    font-family: var(--primary-font);
    margin: 0.5rem 0;
    font-weight: normal;
    font-size: 1.3rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > * {
    margin: 10px 0;
  }
`;

const StyledInput = styled.input`
  font-size: 3rem;
  text-align: center;
  background: none;
  outline: none;
  border-bottom: 2px solid;
  width: 13rem;
  padding: 0 0 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

const CreateRoomButton = styled(BigButton)`
  padding-left: 2em;
  padding-right: 2em;
`;

const ErrorText = styled.p`
  color: red;
`;

const CreateRoomPage: React.FC = () => {
  const comm = useContext(CommContext);
  const { room, error } = useCommHooks(comm);
  const [hostName, setHostName] = useState('');
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [selectedGame] = useState('shake');

  const validated = (name: string, game: string) => {
    const trimmedName = name.trim();
    if (name.trim().length === 0) {
      return {
        name,
        gameName: game,
        errors: ['Host name cannot be empty'],
      };
    }
    return {
      name: trimmedName,
      gameName: game,
      errors: [] as string[],
    };
  };

  const attemptCreation = () => {
    const { name, gameName, errors } = validated(hostName, selectedGame);
    if (errors.length) {
      setInputErrors(errors);
      return;
    }
    comm.createRoom(name, gameName);
    // No need for cleanup - if the room creation is successful, redirect to the
    // HostRoom page. Cleanup/room leave to be executed on room cancellation.
  };

  // TODO: stylise error
  if (error !== null) {
    return <p>Error: {error.toString()}</p>;
  }

  if (room !== null) {
    return <Redirect to="/room" />;
  }

  return (
    <CreateRoomContainer>
      <PindaHappySVG />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          attemptCreation();
        }}
      >
        <StyledInput
          name="host-name"
          type="text"
          pattern="[a-zA-Z\s]*"
          value={hostName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHostName(event.target.value);
          }}
        />
        <CreateRoomButton
          type="submit"
          disabled={!hostName.length}
        >
          Make Room
        </CreateRoomButton>
        {inputErrors.map((inputError) => (
          <ErrorText>
            {inputError}
          </ErrorText>
        ))}
      </Form>
      <Link to={{ pathname: '/' }}>Cancel</Link>
    </CreateRoomContainer>
  );
};

export default CreateRoomPage;
