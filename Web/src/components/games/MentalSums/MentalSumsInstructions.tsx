import React from 'react';
import { ReactComponent as ShakePhoneSVG } from 'svg/shake-phone-badge.svg';
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
      <ShakePhoneSVG />
      <p>
        After the timer starts, you will be given 30 seconds to answer as many
        mental sums as possible.
      </p>
    </GameInstructions>
  );

export default BalloonShakeInstructions;
