import React, { FC } from 'react';
import Button from 'components/common/Button';
import BigButton from 'components/common/BigButton';
import styled from 'styled-components';
import { MotionPermission } from './GameStates';

interface IProps {
  permission: MotionPermission;
  showPermissionRequest: boolean;
  requestPermissionCallback: () => Promise<void>;
  startGame: () => void;
}

const Container = styled.div`
  background: var(--pale-purple);
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const GamePrep: FC<IProps> = props => {
  const {
    permission, showPermissionRequest, requestPermissionCallback, startGame,
  } = props;
  return (
    <Container>
      {permission === MotionPermission.NOT_SET && !showPermissionRequest
        && (
          <h3>
            Checking if you can play the game...
          </h3>
        )}
      {permission === MotionPermission.NOT_SET && showPermissionRequest
        && (
          <Button onClick={() => requestPermissionCallback()} type="button">
            Set Permission
          </Button>
        )}
      {permission === MotionPermission.GRANTED
        && (
          <BigButton onClick={startGame} type="button">
            Start Game!
          </BigButton>
        )}
    </Container>
  );
};

export default GamePrep;
