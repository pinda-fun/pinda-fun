import React, { useState } from 'react';
import styled from 'styled-components';
import { MotionPermission } from 'components/games/GameStates';
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

type UsernameFormProps = {
  onSubmitName: (name: string) => void;
  permission: MotionPermission;
};

const UsernameForm: React.FC<UsernameFormProps> = ({
  onSubmitName,
  permission,
}) => {
  const [name, setName] = useState('');

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitName(name);
      }}
    >
      <h1>Enter Name</h1>
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
      <SubmitButton
        type="submit"
        disabled={name === ''
          || permission === MotionPermission.DENIED}
      >
        Let&apos;s Go!
      </SubmitButton>
    </Form>
  );
};

export default UsernameForm;
