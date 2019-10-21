import React, { useState, useEffect } from 'react';
import seedrandom from 'seedrandom';
import { share } from 'rxjs/operators';
import { useQuestionStream } from './ProblemGen';
import { createTimerObservable } from '../rxhelpers';
import styled from 'styled-components';

const GAME_TIME = 30;

interface MentalSumsGameProps {
  onCompletion: () => void;
  seed: string;
};

const GameContainer = styled.div`
  background: var(--pale-yellow);
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  z-index: -999;

  & > * {
    z-index: 1;
  }
`;

const StyledInput = styled.input`
  font-size: 3rem;
  text-align: center;
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid;
  width: 13rem;
  letter-spacing: 1rem;
  padding: 0 0 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

const TimeLeft = styled.h2`
  font-size: 3rem;
  margin: 0 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const QuestionDisplay = styled.h2`
  font-family: var(--primary-font), sans-serif;
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const ScoreDisplay = styled.h2`
  font-family: var(--primary-font), sans-serif;
  font-size: 3rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const MentalSumsGame: React.FC<MentalSumsGameProps> = ({
  onCompletion, seed
}) => {
  const [score, setScore] = useState(0);
  const { problemText, expectedAns, nextProblem } = useQuestionStream(seedrandom(seed));
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [input, setInput] = useState('');

  const incrementScore = () => setScore(prev => prev + 1);

  const checkAns = (input: string) => {
    if (expectedAns === null) return;
    if (input.length < expectedAns.toString().length) return;
    if (parseInt(input, 10) === expectedAns) incrementScore();
    nextProblem();
    setInput('');
  };

  useEffect(() => {
    nextProblem();
    const timer = createTimerObservable(GAME_TIME).pipe(share());
    const timerSub = timer.subscribe(
      left => setTimeLeft(left),
      null,
      () => onCompletion(),
    );
    return () => timerSub.unsubscribe();
  }, []);

  return (
    <GameContainer>
      <TimeLeft>
        Time left: {timeLeft}
      </TimeLeft>
      <QuestionDisplay>
        {problemText}
      </QuestionDisplay>
      <StyledInput
        onChange={(e) => {
          const newInput = e.target.value.replace(/[^0-9\-]/g, '');
          setInput(newInput);
          checkAns(newInput);
        }}
        value={input}
        name="answer-field"
        type="text"
      />
      <ScoreDisplay>
        Score: {score}
      </ScoreDisplay>
    </GameContainer>
  );
};

export default MentalSumsGame;
