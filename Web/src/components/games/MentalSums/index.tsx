import React, { useState, useEffect, useContext } from 'react';
import { share } from 'rxjs/operators';
import CommContext from 'components/room/comm/CommContext';
import MentalSumsGame from './MentalSumsGame';
import { GameState } from '../GameStates';
import MentalSumsInstructions from './MentalSumsInstructions';
import Countdown from '../Countdown';
import { createTimerObservable } from '../rxhelpers';
import TimesUp from '../TimesUp';

const GAME_TIME = 20;

interface MentalSumsProps {
  seed: string,
}

const MentalSums: React.FC<MentalSumsProps> = ({ seed }) => {
  const [gameState, setGameState] = useState(GameState.INSTRUCTIONS);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [playerScore, setPlayerScore] = useState(0);

  const comm = useContext(CommContext);

  const incrementScore = () => setPlayerScore((prev) => prev + 1);

  const sendGameResults = () => {
    comm.sendResult([playerScore]);
  };

  useEffect(() => {
    if (gameState !== GameState.IN_PROGRESS) return undefined;
    const timer = createTimerObservable(GAME_TIME).pipe(share());
    const timerSub = timer.subscribe(
      (left) => setTimeLeft(left),
      null,
      () => setGameState(GameState.TIMES_UP),
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
      {gameState === GameState.TIMES_UP
        && (
          <TimesUp
            onComplete={sendGameResults}
          />
        )}
    </>
  );
};

export default MentalSums;
