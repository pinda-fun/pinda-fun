import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Form, SubmitButton } from './FormElements';

const StyledNameInput = styled.input`
  font-size: 1.8rem;

  background: none;
  outline: none;
  border-bottom: 2px solid;
  width: 13rem;
  padding: 0 0 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

const ErrorText = styled.p`
  color: red;
`;

type UsernameFormProps = {
  /** Callback for when permission is called. */
  onSubmitName: (name: string) => void;
  /** Additional condition to invalidate the form by. */
  disabled?: boolean;
};

function filterName(name: string): string {
  return name.replace(/[^a-z0-9 ]/gi, '');
}

const UsernameForm: React.FC<UsernameFormProps> = ({
  onSubmitName,
  disabled = false,
}) => {
  const [selectionRange, setSelectionRange] = useState<[HTMLInputElement, number] | null>(null);
  const [name, setName] = useState('');
  const [inputErrors, setInputErrors] = useState<string[]>([]);

  // Simple validation against whitespace names
  const validated = (inputName: string) => {
    const trimmedName = inputName.trim();
    if (inputName.trim().length === 0) {
      return {
        name: inputName,
        errors: ['Your name cannot be empty'],
      };
    }
    return {
      name: trimmedName,
      errors: [] as string[],
    };
  };

  const attemptSubmit = () => {
    const { name: validatedName, errors } = validated(name);
    if (errors.length) {
      setInputErrors(errors);
      return;
    }
    onSubmitName(validatedName);
  };

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
    setName((oldName) => filterName(oldName.slice(0, idx) + data + oldName.slice(idx)));
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
      setName((oldName) => oldName.slice(0, idx - 1) + oldName.slice(idx));
      setSelectionRange([target, idx - 1]);
    }
  };


  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        attemptSubmit();
      }}
    >
      <h1>Enter Your Name</h1>
      <StyledNameInput
        name="username"
        type="text"
        placeholder="eg. Ben Leong"
        value={name}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onChange={(e) => e.preventDefault()}
        autoFocus
      />
      {inputErrors.map((inputError) => (
        <ErrorText>
          {inputError}
        </ErrorText>
      ))}
      <SubmitButton
        type="submit"
        disabled={name === '' || disabled}
      >
        Let&apos;s Go!
      </SubmitButton>
    </Form>
  );
};

export default UsernameForm;
