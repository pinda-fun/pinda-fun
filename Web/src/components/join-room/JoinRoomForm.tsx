import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import LinkButton from 'components/common/LinkButton';
import { MotionPermission } from 'components/games/GameStates';
import GamePinForm from 'components/common/forms/GamePinForm';
import UsernameForm from 'components/common/forms/UsernameForm';
import CommContext from 'components/room/comm/CommContext';

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
  const comm = useContext(CommContext);

  const handleSubmitGamePin = (pin: string) => {
    setGamePin(pin);
    setIsGamePinSet(true);
  };

  const handleSubmitUsername = (name: string) => {
    submitJoinRoomForm(gamePin, name);
  };

  const backButtonHandler = () => {
    setIsGamePinSet(false);
    comm.cleanup();
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
              onClick={backButtonHandler}
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
