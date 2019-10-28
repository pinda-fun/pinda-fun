import React, { useState } from 'react';
import styled from 'styled-components';
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

const UsernameForm: React.FC<UsernameFormProps> = ({
  onSubmitName,
  disabled = false,
}) => {
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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
          setName(event.target.value.replace(/[^a-z0-9 ]/gi, ''))
        )}
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
