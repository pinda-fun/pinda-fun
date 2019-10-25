import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LinkButton from 'components/common/LinkButton';
import { MotionPermission } from 'components/games/GameStates';
import GamePinForm from './GamePinForm';
import UsernameForm from './UsernameForm';

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

  let gamePin = initialId ? initialId.substring(0, pinLength) : '';
  let username = '';

  const handleSubmitGamePin = (pin: string) => {
    gamePin = pin;
    setIsGamePinSet(true);
  };

  const handleSubmitUsername = (name: string) => {
    username = name;
    submitJoinRoomForm(gamePin, username);
  };

  return (
    <>
      {!isGamePinSet
        && (
          <>
            <GamePinForm
              onSubmitPin={handleSubmitGamePin}
              pinLength={pinLength}
              initialPin={gamePin}
              permission={permission}
            />
            <Link to={{ pathname: '/' }}>Cancel</Link>
          </>
        )}
      {isGamePinSet
        && (
          <>
            <UsernameForm
              onSubmitName={handleSubmitUsername}
              permission={permission}
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
