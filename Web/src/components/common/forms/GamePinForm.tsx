import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
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
  /** Callback when submit button is pressed. */
  onSubmitPin: (gamePin: string) => void;
  /** Length of pin - form would be invalid if not this length. */
  pinLength: number;
  /** Default value (optional). */
  initialPin?: string;
  /** Additional conditions to disable the form by. */
  disabled: boolean;
}

function filterGamePin(pin: string): string {
  return pin.replace(/\D/g, '');
}

const GamePinForm: React.FC<GamePinFormProps> = ({
  onSubmitPin,
  pinLength,
  initialPin = '',
  disabled,
}) => {
  const [selectionRange, setSelectionRange] = useState<[HTMLInputElement, number] | null>(null);
  const [gamePin, setGamePin] = useState(initialPin);

  /*
  TRYING TO PREVENT SHAKE TO UNDO FROM HAPPENING
  WHAT THE HECK APPLE. CAN YOU CHECK FOR INPUT ELEMENT EXISTENCE
  INSTEAD OF JUST STUPIDLY SHOWING UP THE DIALOGUE EVEN WHEN THE FORM IS GONE?

  I CAN'T UNDO WHAT I WROTE WRONGLY IN THE EXAMS THAT I'VE SUBMITTED, CAN I?
  */
  const handleBeforeInput = (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = event as unknown as InputEvent;
    if (data == null) return;
    const target = event.target as HTMLInputElement;
    const idx = target.selectionStart;
    if (idx == null) return;
    setGamePin(
      (oldGamePin) => filterGamePin(oldGamePin.slice(0, idx) + data + oldGamePin.slice(idx)),
    );
    setSelectionRange([target, idx + 1]);
  };

  useEffect(() => {
    if (selectionRange == null) return;
    const [target, start] = selectionRange;
    target.setSelectionRange(start, start);
  }, [selectionRange]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      event.preventDefault();
      const idx = target.selectionStart;
      if (idx == null) return;
      setGamePin((oldGamePin) => oldGamePin.slice(0, idx - 1) + oldGamePin.slice(idx));
      setSelectionRange([target, idx - 1]);
    } else if (event.key === 'Delete') {
      event.preventDefault();
      const idx = target.selectionStart;
      if (idx == null) return;
      setGamePin((oldGamePin) => oldGamePin.slice(0, idx) + oldGamePin.slice(idx + 1));
      setSelectionRange([target, idx]);
    }
  };


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
        autoComplete="off"
        value={gamePin}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => e.preventDefault()}
        autoFocus
      />
      <SubmitButton
        type="submit"
        disabled={gamePin.length !== pinLength || disabled}
      >
        Next
      </SubmitButton>
    </Form>
  );
};

export default GamePinForm;
