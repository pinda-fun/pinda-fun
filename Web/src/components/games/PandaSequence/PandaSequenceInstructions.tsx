import React from 'react';
import { ReactComponent as MemoryGameSVG } from 'svg/memory-game-badge.svg';
import GameInstructions from '../GameInstructions';

type GameInstructionsProps = {
  seconds?: number;
  onComplete?: () => void;
  actions: React.ReactNode;
};

const PandaSequenceInstructions: React.FC<GameInstructionsProps> = ({
  seconds,
  onComplete,
  actions,
}) => (
  <GameInstructions
    title="Peek-a-boo"
    seconds={seconds}
    onComplete={onComplete}
    actions={actions}
  >
    <MemoryGameSVG />
    <p>
      Watch carefully as the pandas emerge from their flower pots. Repeat the sequence
      when the background turns purple.
    </p>
  </GameInstructions>
);

export default PandaSequenceInstructions;
