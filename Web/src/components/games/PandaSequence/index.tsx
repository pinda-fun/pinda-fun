import React, { useState, useEffect } from 'react';
import { share } from 'rxjs/operators';
import { Sequence, PandaSequenceMode } from './Sequence';
import { createTimerObservable } from '../rxhelpers';
import { GameState } from '../BalloonShake/GameStates';
import SequenceDisplay from './SequenceDisplay';
import UseSeqGenerator from './useSeqGenerator';


const GAME_TIME = 25;
const SEED = '100';
const NUM_POTS = 5;


const PandaSequence: React.FC = () => {
  const [gameState, setGameState] = useState(GameState.WAITING_START);
  const [mode, setMode] = useState(PandaSequenceMode.DISPLAY);
  const [secondsLeft, setSecondsLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<Sequence>({ timestep: 0, numbers: [] });
  const [index, setIndex] = useState(0);
  const [inputIndex, setInputIndex] = useState(0);
  const [{ generate }] = useState(UseSeqGenerator(SEED, 0, NUM_POTS));

  /** Setup game and trigger first sequence */
  useEffect(() => {
    const timer = createTimerObservable(GAME_TIME).pipe(share());
    timer.subscribe(
      left => setSecondsLeft(left),
      null,
      () => setGameState(GameState.WAITING_RESULTS),
    );
    setSequence(generate());
    setGameState(GameState.IN_PROGRESS);
  }, [generate]);

  /** Display new sequence */
  useEffect(() => {
    if (sequence.numbers.length === 0) return;

    const { timestep, numbers } = sequence;
    const timer = createTimerObservable(numbers.length, timestep).pipe(share());
    timer.subscribe(
      () => {
        setIndex(oldIndex => oldIndex + 1);
      },
      null,
      () => {
        setMode(PandaSequenceMode.INPUT);
      },
    );
  }, [sequence]);

  /** Process user input */
  const handleInputEvent = (input:number) => {
    const { numbers } = sequence;
    if (numbers[inputIndex] === input) {
      if (inputIndex === numbers.length - 1) {
        setScore(oldScore => oldScore + numbers.length);
        setMode(PandaSequenceMode.DISPLAY);
      } else {
        setInputIndex(oldIndex => oldIndex + 1);
      }
    } else {
      setMode(PandaSequenceMode.DISPLAY);
    }
  };

  /** Handle mode change */
  useEffect(() => {
    // TODO: if (mode === PandaSequenceMode.INPUT) { }
    if (mode === PandaSequenceMode.DISPLAY) {
      setSequence(generate());
      setIndex(0);
    }
  }, [mode, generate]);

  return (
    <>
      {gameState === GameState.IN_PROGRESS
        && (
        <SequenceDisplay
          mode={mode}
          secondsLeft={secondsLeft}
          score={score}
          active={sequence.numbers[index]}
          handleInputEvent={handleInputEvent}
        />
        )}
      {gameState === GameState.WAITING_RESULTS
        && <h2>Done</h2>}
    </>
  );
};

export default PandaSequence;
