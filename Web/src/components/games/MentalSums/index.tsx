import React, { useState } from 'react';
import MentalSumsGame from './MentalSumsGame';
import { GameState } from '../GameStates';

export default () => {
  const [gameState, getGameState] = useState(GameState.INSTRUCTIONS);
  return (
    <>
      <MentalSumsGame onCompletion={() => { }} seed="ben-leong" />
    </>
  )
}
