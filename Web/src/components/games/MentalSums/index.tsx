import React, { useState } from 'react';
import MentalSumsGame from './MentalSumsGame';
import { GameState } from '../GameStates';
import MentalSumsInstructions from './MentalSumsInstructions';
import Countdown from '../Countdown';
import GameResults from './GameResults';

const MentalSums: React.FC = () => {
  const [gameState, setGameState] = useState(GameState.INSTRUCTIONS);
  const [playerScore, setPlayerScore] = useState(0);

  const finishGame = () => {
    setGameState(GameState.WAITING_RESULTS);
  };

  const incrementScore = () => setPlayerScore(prev => prev + 1);

  return (
    <>
      {gameState === GameState.INSTRUCTIONS
        && (
          <MentalSumsInstructions
            onComplete={() => setGameState(GameState.COUNTING_DOWN)}
            seconds={5}
          />
        )}
      {gameState === GameState.COUNTING_DOWN
        && <Countdown seconds={3} onComplete={() => setGameState(GameState.IN_PROGRESS)} />}
      {gameState === GameState.IN_PROGRESS
        && (
          <MentalSumsGame
            onCompletion={finishGame}
            score={playerScore}
            incrementScore={incrementScore}
            seed="ben-leong"
          />
        )}
      {gameState === GameState.WAITING_RESULTS
        && <GameResults finalCount={playerScore} />}
    </>
  );
};

export default MentalSums;
