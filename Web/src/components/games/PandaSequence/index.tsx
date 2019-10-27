import React, { useState, useEffect } from 'react';
import { PandaSequenceMode } from './Sequence';
import { createTimerObservable } from '../rxhelpers';
import { GameState } from '../GameStates';
import Countdown from '../Countdown';
import GameResults from './GameResults';
import GameDisplay from './GameDisplay';
import PandaSequenceInstructions from './PandaSequenceInstructions';
import { randomWithinBounds, generate } from './SequenceGenerator';

const GAME_TIME = 30;
const INIT_SEQUENCE = { timestep: 1000, numbers: [0, 0] };

const PandaSequence: React.FC = () => {
  const [gameState, setGameState] = useState(GameState.INSTRUCTIONS);
  const [secondsLeft, setSecondsLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState(PandaSequenceMode.DISPLAY);

  const [generator] = useState(randomWithinBounds(0, 5));
  const [sequence, setSequence] = useState(INIT_SEQUENCE);
  const [index, setIndex] = useState(0);
  const [inputIndex, setInputIndex] = useState(0);

  // setup game and trigger first sequence
  useEffect(() => {
    if (gameState !== GameState.IN_PROGRESS) return () => {};

    const timer = createTimerObservable(GAME_TIME);
    const timerSub = timer.subscribe(
      (left) => setSecondsLeft(left),
      null,
      () => setGameState(GameState.WAITING_RESULTS),
    );
    setSequence((oldSeq) => generate(oldSeq, generator));
    return () => timerSub.unsubscribe();
  }, [generator, gameState]);

  // display new sequence
  useEffect(() => {
    if (sequence === INIT_SEQUENCE) return () => {};

    const { timestep, numbers } = sequence;
    const timer = createTimerObservable(numbers.length + 1, timestep);
    const timerSub = timer.subscribe(
      () => setIndex((oldIndex) => oldIndex + 1),
      null,
      () => setMode(PandaSequenceMode.INPUT),
    );
    return () => timerSub.unsubscribe();
  }, [sequence]);

  // handle mode change
  useEffect(() => {
    if (mode === PandaSequenceMode.INPUT) {
      setInputIndex(0);
    } else if (mode === PandaSequenceMode.DISPLAY) {
      setIndex(-1);
    }
  }, [mode]);

  /**
   * Returns true if sequence is ending, i.e. it will be completed with
   * one more input.
   */
  const isLastInSequence = () => {
    const { numbers } = sequence;

    return inputIndex === numbers.length - 1;
  };

  const processCorrectInput = () => {
    if (isLastInSequence()) {
      // update score, mode and sequence if current sequence is done
      setScore((oldScore) => oldScore + 1);
      setMode(PandaSequenceMode.DISPLAY);
      setSequence((oldSeq) => generate(oldSeq, generator));
    } else {
      // update inputIndex
      setInputIndex((oldIndex) => oldIndex + 1);
    }
  };

  const processWrongInput = () => {
    // update mode and reset current sequence
    setMode(PandaSequenceMode.DISPLAY);
    setSequence((oldSeq) => ({ ...oldSeq }));
  };

  /**
   * Callback to process user input in game display. Returns true if input
   * is correct and false otherwise.
   */
  const processInput = (input: number) => {
    const { numbers } = sequence;

    if (numbers[inputIndex] === input) {
      processCorrectInput();
      return true;
    }
    processWrongInput();
    return false;
  };

  return (
    <>
      {gameState === GameState.INSTRUCTIONS
        && (
          <PandaSequenceInstructions
            onComplete={() => setGameState(GameState.COUNTING_DOWN)}
            seconds={5}
          />
        )}
      {gameState === GameState.COUNTING_DOWN
      && <Countdown seconds={3} onComplete={() => setGameState(GameState.IN_PROGRESS)} />}
      {gameState === GameState.IN_PROGRESS
      && (
        <GameDisplay
          mode={mode}
          secondsLeft={secondsLeft}
          score={score}
          isLastInSequence={isLastInSequence}
          processInput={processInput}
          displaying={sequence.numbers[index]}
          timestep={sequence.timestep}
        />
      )}
      {gameState === GameState.WAITING_RESULTS
      && <GameResults finalCount={score} />}
    </>
  );
};

export default PandaSequence;
