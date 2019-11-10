import React, { lazy } from 'react';
import Game from './Games';

const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const MentalSums = lazy(() => import('components/games/MentalSums'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));

const BalloonShakeInstructions = lazy(() => import('components/games/BalloonShake/BalloonShakeInstructions'));
const MentalSumsInstructions = lazy(() => import('components/games/MentalSums/MentalSumsInstructions'));
const PandaSequenceInstructions = lazy(() => import('components/games/PandaSequence/PandaSequenceInstructions'));

export const GameComponent: React.FC<{ game: Game, seed: string }> = ({ game, seed }) => (
  <>
    {game === Game.SHAKE
      && <BalloonShake />}
    {game === Game.SUMS
      && <MentalSums seed={seed} />}
    {game === Game.SEQUENCE
      && <PandaSequence seed={seed} />}
  </>
);

export const GameInstructionComponent: React.FC<{ game: Game, actions: React.ReactNode }> = ({
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
