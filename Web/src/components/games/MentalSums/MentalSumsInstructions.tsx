import React from 'react';
import { ReactComponent as MentalSumsSVG } from 'svg/mental-sums-badge.svg';
import GameInstructions from '../GameInstructions';

type GameInstructionsProps = {
  seconds?: number;
  onComplete?: () => void;
};

const BalloonShakeInstructions: React.FC<GameInstructionsProps> = ({
  seconds,
  onComplete,
}) => (
  <GameInstructions
    title="Pinda Sums"
    seconds={seconds}
    onComplete={onComplete}
  >
    <MentalSumsSVG />
    <p>
        After the timer starts, you will be given 30 seconds to solve as many
        problems as you can.
    </p>
  </GameInstructions>
);

export default BalloonShakeInstructions;
