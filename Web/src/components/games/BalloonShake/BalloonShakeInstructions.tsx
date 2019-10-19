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
    title="Shake Me Up!"
    seconds={seconds}
    onComplete={onComplete}
  >
    <ShakePhoneSVG />
    <p>
      After the timer starts, you will be given 20 seconds to shake your phone to
      blow up the balloon! Player with least number of shakes LOSES.
    </p>
  </GameInstructions>
);

export default BalloonShakeInstructions;
