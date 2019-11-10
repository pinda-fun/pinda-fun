import React, { useState, useEffect, useContext } from 'react';
import CommContext from 'components/room/comm/CommContext';
import { PandaSequenceMode, Feedback } from './Sequence';
import { createTimerObservable } from '../rxhelpers';
import { GameState } from '../GameStates';
import Countdown from '../Countdown';
import GameDisplay, { NUM_POTS } from './GameDisplay';
import { randomWithinBounds, generate } from './SequenceGenerator';
import TimesUp from '../TimesUp';

const GAME_TIME = 30;
const INIT_SEQUENCE = { timestep: 1000, numbers: [0, 0] };
const POST_FEEDBACK_DELAY = 700;


interface PandaSequenceProps {
  seed: string,
}

const PandaSequence: React.FC<PandaSequenceProps> = ({ seed }) => {
  const [gameState, setGameState] = useState(GameState.COUNTING_DOWN);
  const [secondsLeft, setSecondsLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState(PandaSequenceMode.DISPLAY);

  const [generator] = useState(randomWithinBounds(0, NUM_POTS, seed));
  const [sequence, setSequence] = useState(INIT_SEQUENCE);
  const [index, setIndex] = useState(0);
  const [inputIndex, setInputIndex] = useState(0);
  const [feedback, setFeedback] = useState(Feedback.NONE);

  const comm = useContext(CommContext);

  const sendGameResults = () => {
    comm.sendResult([score]);
    setGameState(GameState.COMPLETED);
  };

  // setup game and trigger first sequence
  useEffect(() => {
    if (gameState !== GameState.IN_PROGRESS) return undefined;

    const timer = createTimerObservable(GAME_TIME);
    const timerSub = timer.subscribe(
      (left) => setSecondsLeft(left),
      null,
      () => setGameState(GameState.TIMES_UP),
    );
    setSequence((oldSeq) => generate(oldSeq, generator));
    return () => timerSub.unsubscribe();
  }, [generator, gameState]);

  // display new sequence
  useEffect(() => {
    if (sequence === INIT_SEQUENCE) return undefined;

    const { timestep, numbers } = sequence;
    const timer = createTimerObservable(numbers.length, timestep);
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

  const processCorrectInput = (numbers: number[]) => {
    if (inputIndex === numbers.length - 1) {
      // update score, mode and sequence if current sequence is done
      setFeedback(Feedback.CORRECT);
      setMode(PandaSequenceMode.DISPLAY);
      setScore((oldScore) => oldScore + 1);
      // wait for feedback animation completion before proceeding
      setTimeout(() => {
        setSequence((oldSeq) => generate(oldSeq, generator));
        setFeedback(() => Feedback.NONE);
      }, POST_FEEDBACK_DELAY);
    } else {
      // update inputIndex
      setInputIndex((oldIndex) => oldIndex + 1);
    }
  };

  const processWrongInput = () => {
    // update mode and reset current sequence
    setFeedback(Feedback.WRONG);
    setMode(PandaSequenceMode.DISPLAY);
    setTimeout(() => {
      setSequence((oldSeq) => ({ ...oldSeq }));
      setFeedback(() => Feedback.NONE);
    }, POST_FEEDBACK_DELAY);
  };

  /**
   * Callback to process user input in game display. Returns true if input
   * is correct and false otherwise.
   */
  const processInput = (input: number) => {
    const { numbers } = sequence;

    if (numbers[inputIndex] === input) {
      processCorrectInput(numbers);
      return true;
    }
    processWrongInput();
    return false;
  };

  return (
    <>
      {gameState === GameState.COUNTING_DOWN
        && <Countdown seconds={3} onComplete={() => setGameState(GameState.IN_PROGRESS)} />}
      {gameState === GameState.IN_PROGRESS
        && (
          <GameDisplay
            mode={mode}
            secondsLeft={secondsLeft}
            score={score}
            processInput={processInput}
            feedback={feedback}
            timestep={sequence.timestep}
            displaying={sequence.numbers[index]}
          />
        )}
      {gameState === GameState.TIMES_UP
        && (
          <TimesUp
            onComplete={sendGameResults}
          />
        )}
      {gameState === GameState.COMPLETED && (
        <TimesUp onComplete={() => { }} />
      )}
    </>
  );
};

export default PandaSequence;
