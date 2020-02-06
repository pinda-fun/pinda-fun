import React from 'react';
import { ReactComponent as MentalSumsSVG } from 'svg/mental-sums-badge.svg';
import GameInstructions from '../GameInstructions';

type GameInstructionsProps = {
  seconds?: number;
  onComplete?: () => void;
  actions: React.ReactNode;
};

const BalloonShakeInstructions: React.FC<GameInstructionsProps> = ({
  seconds,
  onComplete,
  actions,
}) => (
  <GameInstructions
    title="Pinda Sums"
    seconds={seconds}
    onComplete={onComplete}
    actions={actions}
  >
    <MentalSumsSVG />
    <p>
      After the timer starts, you will be given 20 seconds to solve as many
      problems as you can.
    </p>
  </GameInstructions>
);

export default BalloonShakeInstructions;
