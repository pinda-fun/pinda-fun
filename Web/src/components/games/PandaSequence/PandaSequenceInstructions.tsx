import React from 'react';
import { ReactComponent as MemoryGameSVG } from 'svg/memory-game-badge.svg';
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
    title="Peek-a-boo"
    seconds={seconds}
    onComplete={onComplete}
  >
    <MemoryGameSVG />
    <p>
      Watch carefully as the pandas emerge from their flower pots. Repeat the sequence
      when the background turns purple.
    </p>
  </GameInstructions>
);

export default PandaSequenceInstructions;
