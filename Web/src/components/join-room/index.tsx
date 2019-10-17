import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BigButton from '../common/BigButton';
import { ReactComponent as PindaHeadSVG } from '../../svg/pinda-head-happy.svg';

const PIN_LENGTH = 4;

const JoinRoomContainer = styled.div`
  background: var(--pale-purple);
  min-height: 100vh;
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

const JoinRoomForm = styled.form`
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
  border: none;
  border-bottom: 2px solid;
  width: 13rem;
  letter-spacing: 1rem;
  padding: 0 0 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

const JoinRoomButton = styled(BigButton)`
  padding-left: 2em;
  padding-right: 2em;
`;

const JoinRoomPage: React.FC = () => {
  const [gamePin, setGamePin] = useState('');

  const onJoinRoomFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Perform join room with gamePin
  };

  return (
    <JoinRoomContainer>
      <PindaHead />
      <h1>Enter Game PIN</h1>
      <JoinRoomForm onSubmit={onJoinRoomFormSubmit}>
        <StyledInput
          name="gamepin"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          placeholder="XXXX"
          value={gamePin}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
            setGamePin(event.target.value.replace(/\D/g, ''))
          )}
        />
        <JoinRoomButton type="submit" disabled={gamePin.length < PIN_LENGTH}>
          Let&apos;s Go!
        </JoinRoomButton>
        <Link to={{ pathname: '/' }}>Cancel</Link>
      </JoinRoomForm>
    </JoinRoomContainer>
  );
};

export default JoinRoomPage;
