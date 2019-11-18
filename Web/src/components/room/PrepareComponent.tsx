import React, { lazy } from 'react';
import BigButton from 'components/common/BigButton';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Game from './Games';

const BalloonShakeInstructions = lazy(() => import('components/games/BalloonShake/BalloonShakeInstructions'));
const MentalSumsInstructions = lazy(() => import('components/games/MentalSums/MentalSumsInstructions'));
const PandaSequenceInstructions = lazy(() => import('components/games/PandaSequence/PandaSequenceInstructions'));

export interface PreparedComponentProps {
  isReady: boolean;
  onReadyClick: () => void;
  game: Game;
}

const InverseButton = styled(BigButton)`
  background: white;
  color: var(--purple);
`;

const WhiteLink = styled(Link)`
  color: white;
`;

const GameInstructionComponent: React.FC<{ game: Game, actions: React.ReactNode }> = ({
  game, actions,
}) => (
  <>
    {game === Game.SHAKE
      && <BalloonShakeInstructions actions={actions} />}
    {game === Game.SUMS
      && <MentalSumsInstructions actions={actions} />}
    {game === Game.SEQUENCE
      && <PandaSequenceInstructions actions={actions} />}
  </>
);

const defaultPreparedComponent: React.FC<PreparedComponentProps> = ({
  isReady, onReadyClick, game,
}) => {
  const actions = (
    <>
      {isReady && <p>Waiting for other players</p>}
      {!isReady && <InverseButton onClick={onReadyClick}>I am ready!</InverseButton>}
      <WhiteLink to={{ pathname: '/' }}>Quit</WhiteLink>
    </>
  );

  return <GameInstructionComponent game={game} actions={actions} />;
};

export default defaultPreparedComponent;
