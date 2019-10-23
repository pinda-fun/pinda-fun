import React, { useState, useEffect } from 'react';
import { PandaSequenceMode } from './Sequence';
import { createTimerObservable } from '../rxhelpers';
import { GameState } from '../GameStates';
import GameResults from './GameResults';
import GameDisplay from './GameDisplay';
import { randomWithinBounds, generate } from './SequenceGenerator';

const GAME_TIME = 100;
const SEED = '100';
const INIT_SEQUENCE = { timestep: 1000, numbers: [0, 0] };

const PandaSequence: React.FC = () => {
  const [gameState, setGameState] = useState(GameState.WAITING_START);
  const [secondsLeft, setSecondsLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState(PandaSequenceMode.DISPLAY);

  const [generator] = useState(randomWithinBounds(0, 5, SEED));
  const [sequence, setSequence] = useState(INIT_SEQUENCE);
  const [index, setIndex] = useState(0);
  const [inputIndex, setInputIndex] = useState(0);

  /** Setup game and trigger first sequence */
  useEffect(() => {
    const timer = createTimerObservable(GAME_TIME);
    const timerSub = timer.subscribe(
      (left) => setSecondsLeft(left),
      null,
      () => setGameState(GameState.WAITING_RESULTS),
    );
    setGameState(GameState.IN_PROGRESS);
    return () => timerSub.unsubscribe();
  }, []);

  /** Display new sequence */
  useEffect(() => {
    if (sequence.numbers.length === 0) return () => {};

    const { timestep, numbers } = sequence;
    const timer = createTimerObservable(numbers.length + 1, timestep);
    const timerSub = timer.subscribe(
      () => setIndex((oldIndex) => oldIndex + 1),
      null,
      () => setMode(PandaSequenceMode.INPUT),
    );
    return () => timerSub.unsubscribe();
  }, [sequence]);

  /** Process user input */
  const processInput = (input: number) => {
    const { numbers } = sequence;
    // validate input against sequence
    if (numbers[inputIndex] === input) {
      // handle end of sequence
      if (inputIndex === numbers.length - 1) {
        setScore((oldScore) => oldScore + numbers.length);
        setMode(PandaSequenceMode.DISPLAY);
      } else {
        setInputIndex((oldIndex) => oldIndex + 1);
      }
    } else {
      setMode(PandaSequenceMode.DISPLAY);
    }
  };

  /** Handle mode change */
  useEffect(() => {
    if (mode === PandaSequenceMode.INPUT) {
      setInputIndex(0);
    } else if (mode === PandaSequenceMode.DISPLAY) {
      setSequence((oldSeq) => generate(oldSeq, generator));
      setIndex(-1);
    }
  }, [mode, generator]);

  console.log(sequence.timestep);
  return (
    <>
      {gameState === GameState.IN_PROGRESS
        && (
          <GameDisplay
            mode={mode}
            secondsLeft={secondsLeft}
            score={score}
            processInput={processInput}
            active={sequence.numbers[index]}
            timestep={sequence.timestep}
          />
        )}
      {gameState === GameState.WAITING_RESULTS
        && <GameResults finalCount={score} />}
    </>
  );
};

export default PandaSequence;
