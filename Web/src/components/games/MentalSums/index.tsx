import React, { useState, useEffect } from 'react';
import { share } from 'rxjs/operators';
import MentalSumsGame from './MentalSumsGame';
import { GameState } from '../GameStates';
import MentalSumsInstructions from './MentalSumsInstructions';
import Countdown from '../Countdown';
import GameResults from './GameResults';
import { createTimerObservable } from '../rxhelpers';

const GAME_TIME = 20;

interface MentalSumsProps {
  seed: string,
}

const MentalSums: React.FC<MentalSumsProps> = ({ seed }) => {
  const [gameState, setGameState] = useState(GameState.INSTRUCTIONS);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [playerScore, setPlayerScore] = useState(0);

  const incrementScore = () => setPlayerScore((prev) => prev + 1);

  useEffect(() => {
    if (gameState !== GameState.IN_PROGRESS) return undefined;
    const timer = createTimerObservable(GAME_TIME).pipe(share());
    const timerSub = timer.subscribe(
      (left) => setTimeLeft(left),
      null,
      () => setGameState(GameState.WAITING_RESULTS),
    );
    return () => timerSub.unsubscribe();
  }, [gameState]);

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
            score={playerScore}
            incrementScore={incrementScore}
            timeLeft={timeLeft}
            seed={seed}
          />
        )}
      {gameState === GameState.WAITING_RESULTS
        && <GameResults finalCount={playerScore} />}
    </>
  );
};

export default MentalSums;
