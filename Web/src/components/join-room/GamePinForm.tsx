import React, { useState } from 'react';
import styled from 'styled-components';
import { MotionPermission } from 'components/games/GameStates';
import { Form, SubmitButton } from './FormElements';

const StyledPinInput = styled.input`
  font-size: 3rem;
  letter-spacing: 1rem;
  text-align: center;

  background: none;
  outline: none;
  border-bottom: 2px solid;
  width: 13rem;
  padding: 0 0 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

interface GamePinFormProps {
  onSubmitPin: (gamePin: string) => void;
  pinLength: number;
  initialPin: string;
  permission: MotionPermission;
}

const GamePinForm: React.FC<GamePinFormProps> = ({
  onSubmitPin,
  pinLength,
  initialPin,
  permission,
}) => {
  const [gamePin, setGamePin] = useState(initialPin);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitPin(gamePin);
      }}
    >
      <h1>Enter Game PIN</h1>
      <StyledPinInput
        name="gamepin"
        type="text"
        pattern="[0-9]*"
        inputMode="numeric"
        maxLength={pinLength}
        placeholder="XXXX"
        value={gamePin}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
          setGamePin(event.target.value.replace(/\D/g, ''))
        )}
        autoFocus
      />
      <SubmitButton
        type="submit"
        disabled={gamePin.length < pinLength
          || permission === MotionPermission.DENIED}
      >
        Next
      </SubmitButton>
    </Form>
  );
};

export default GamePinForm;
