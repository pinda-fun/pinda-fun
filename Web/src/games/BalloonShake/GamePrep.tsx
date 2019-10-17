import React, { FC } from 'react';
import { MotionPermission } from './GameStates';
import Button from 'components/common/Button';
import BigButton from 'components/common/BigButton';
import styled from 'styled-components';
import { mdMin } from 'utils/media';

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
    height: 100%;
`;

const Section = styled.div`
    display: flex;
    justify-content: center;
    padding: 7rem 1rem;
    flex-direction: column;
    align-items: center;

    & > div {
    width: ${mdMin};

    @media (max-width: ${mdMin}) {
    width: calc(100% - 0.5em);
    }
    }
`;

const GamePrep: FC<IProps> = (props) => {
  const {
    permission, showPermissionRequest, requestPermissionCallback, startGame,
  } = props;
  return (
    <Container>
      <Section>
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
      </Section>
    </Container>
  );
}

export default GamePrep;
