import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LinkButton from 'components/common/LinkButton';
import { MotionPermission } from 'components/games/GameStates';
import GamePinForm from 'components/common/forms/GamePinForm';
import UsernameForm from 'components/common/forms/UsernameForm';

const ErrorText = styled.p`
  color: red;
`;

interface JoinRoomFormProps {
  submitJoinRoomForm: (roomId: string, username: string) => void;
  initialId?: string;
  pinLength: number;
  permission: MotionPermission;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({
  submitJoinRoomForm,
  initialId,
  pinLength,
  permission,
}) => {
  const [isGamePinSet, setIsGamePinSet] = useState(false);
  const [gamePin, setGamePin] = useState(initialId || '');

  const handleSubmitGamePin = (pin: string) => {
    setGamePin(pin);
    setIsGamePinSet(true);
  };

  const handleSubmitUsername = (name: string) => {
    submitJoinRoomForm(gamePin, name);
  };

  return (
    <>
      {!isGamePinSet
        && (
          <>
            <GamePinForm
              onSubmitPin={handleSubmitGamePin}
              pinLength={pinLength}
              initialPin={initialId}
              disabled={permission === MotionPermission.DENIED}
            />
            <Link to={{ pathname: '/' }}>Cancel</Link>
          </>
        )}
      {isGamePinSet
        && (
          <>
            <UsernameForm
              onSubmitName={handleSubmitUsername}
              disabled={permission === MotionPermission.DENIED}
            />
            <LinkButton
              underline
              onClick={() => setIsGamePinSet(false)}
            >
              Back
            </LinkButton>
          </>
        )}
      {permission === MotionPermission.DENIED
        && (
          <ErrorText>
            Unable to get permissions to play Pinda.
          </ErrorText>
        )}
    </>
  );
};

export default JoinRoomForm;
