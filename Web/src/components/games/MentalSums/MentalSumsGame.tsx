import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import styled from 'styled-components';
import { useQuestionStream } from './ProblemGen';

interface MentalSumsGameProps {
  incrementScore: () => void;
  score: number;
  timeLeft: number;
  seed: string;
}

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
  incrementScore, score, seed, timeLeft,
}) => {
  const { problemText, expectedAns, nextProblem } = useQuestionStream(seedrandom(seed));
  const [input, setInput] = useState('');

  const checkAns = (newInput: string) => {
    if (expectedAns === null) return;
    if (newInput.length < expectedAns.toString().length) return;
    if (parseInt(newInput, 10) === expectedAns) incrementScore();
    nextProblem();
    setInput('');
  };


  return (
    <GameContainer>
      <TimeLeft>
        Time left: {timeLeft}
      </TimeLeft>
      <QuestionDisplay>
        {problemText}
      </QuestionDisplay>
      <StyledInput
        onChange={e => {
          const newInput = e.target.value.replace(/[^0-9-]/g, '');
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
