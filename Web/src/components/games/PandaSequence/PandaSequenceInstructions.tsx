import React from 'react';
import { ReactComponent as ShakePhoneSVG } from 'svg/shake-phone-badge.svg';
import GameInstructions from '../GameInstructions';

type GameInstructionsProps = {
  seconds?: number;
  onComplete?: () => void;
};

const PandaSequenceInstructions: React.FC<GameInstructionsProps> = ({
  seconds,
  onComplete,
}) => (
  <GameInstructions
    title="Panda Sequence"
    seconds={seconds}
    onComplete={onComplete}
  >
    <ShakePhoneSVG />
    <p>
        After the timer starts, tap each balloon in the sequence they appear in!
    </p>
  </GameInstructions>
);

export default PandaSequenceInstructions;
