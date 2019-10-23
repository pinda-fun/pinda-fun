import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BigButton from 'components/common/BigButton';
import { MotionPermission } from 'components/games/GameStates';

const PIN_LENGTH = 4;

const StyledInput = styled.input`
  font-size: 3rem;
  text-align: center;
  background: none;
  outline: none;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > * {
    margin: 10px 0;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

interface JoinRoomFormProps {
  submitJoinRoomForm: (roomId: string) => void;
  initialId?: string;
  permission: MotionPermission;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({
  submitJoinRoomForm, initialId, permission,
}) => {
  const [gamePin, setGamePin] = useState(initialId ? initialId.substring(0, PIN_LENGTH) : '');

  return (
    <>
      <h1>Enter Game PIN</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          submitJoinRoomForm(gamePin);
        }}
      >
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
          autoFocus
        />
        <JoinRoomButton
          type="submit"
          disabled={gamePin.length < PIN_LENGTH
            || permission === MotionPermission.DENIED}
        >
          Let&apos;s Go!
        </JoinRoomButton>
        {permission === MotionPermission.DENIED
          && (
            <ErrorText>
              Unable to get permissions to play Pinda.
            </ErrorText>
          )}
        <Link to={{ pathname: '/' }}>Cancel</Link>
      </Form>
    </>
  );
};

export default JoinRoomForm;
