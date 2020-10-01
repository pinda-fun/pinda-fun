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

const GamePinForm: React.FC<GamePinFormProps> = ({
  onSubmitPin,
  pinLength,
  initialPin = '',
  disabled,
}) => {
  const [selectionRange, setSelectionRange] = useState<[HTMLInputElement, number] | null>(null);
  const [gamePin, setGamePin] = useState(initialPin);

  const filterGamePin = (oldPin: string, newPin: string): string => {
    const filteredNewPin = newPin.replace(/\D/g, '');
    if (filteredNewPin.length > pinLength) return oldPin;
    return filteredNewPin;
  };

  /*
  TRYING TO PREVENT SHAKE TO UNDO FROM HAPPENING
  WHAT THE HECK APPLE. CAN YOU CHECK FOR INPUT ELEMENT EXISTENCE
  INSTEAD OF JUST STUPIDLY SHOWING UP THE DIALOGUE EVEN WHEN THE FORM IS GONE?

  I CAN'T UNDO WHAT I WROTE WRONGLY IN THE EXAMS THAT I'VE SUBMITTED, CAN I?

  AND NOW ANDROID CHROMIUM DECIDED TO ALSO JUST EMIT Unidentified for BACKSPACE
  UGHHHHHH
  */
  const handleBeforeInput = (event: React.FormEvent) => {
    if (window.navigator.userAgent.includes('Android')) return;
    event.preventDefault();
    const { data } = event as unknown as InputEvent;
    if (data == null) return;
    const target = event.target as HTMLInputElement;
    const [start, end] = [target.selectionStart, target.selectionEnd].sort();
    if (start == null || end == null) return;
    setGamePin(
      (oldGamePin) => filterGamePin(
        oldGamePin,
        oldGamePin.slice(0, start) + data + oldGamePin.slice(end),
      ),
    );
    setSelectionRange([target, start + 1]);
  };

  useEffect(() => {
    if (selectionRange == null) return;
    const [target, start] = selectionRange;
    target.setSelectionRange(start, start);
  }, [selectionRange]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (window.navigator.userAgent.includes('Android')) return;
    const target = event.target as HTMLInputElement;
    const [start, end] = [target.selectionStart, target.selectionEnd].sort();
    if (start == null || end == null) return;
    if (event.key === 'Backspace') {
      event.preventDefault();
      setGamePin((oldGamePin) => {
        if (end - start === 0) {
          const newStart = Math.max(start - 1, 0);
          setSelectionRange([target, newStart]);
          return filterGamePin(oldGamePin, oldGamePin.slice(0, newStart) + oldGamePin.slice(start));
        }
        setSelectionRange([target, start]);
        return filterGamePin(oldGamePin, oldGamePin.slice(0, start) + oldGamePin.slice(end));
      });
    } else if (event.key === 'Delete') {
      event.preventDefault();
      setGamePin((oldGamePin) => {
        if (end - start === 0) {
          setSelectionRange([target, start]);
          return filterGamePin(
            oldGamePin,
            oldGamePin.slice(0, start) + oldGamePin.slice(start + 1),
          );
        }
        setSelectionRange([target, start]);
        return filterGamePin(oldGamePin, oldGamePin.slice(0, start) + oldGamePin.slice(end));
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value;
    setGamePin((oldPin) => filterGamePin(oldPin, newPin));
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
        placeholder="XXXX"
        autoComplete="off"
        value={gamePin}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
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
