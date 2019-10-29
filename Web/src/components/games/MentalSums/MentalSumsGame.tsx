import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import styled, { css } from 'styled-components';
import { smMin } from 'utils/media';
import { useQuestionStream } from './ProblemGen';
import TimerDisplay from '../TimerDisplay';
import NumKeypad from './NumKeypad';

interface MentalSumsGameProps {
  incrementScore: () => void;
  score: number;
  timeLeft: number;
  seed: string;
}

const GameContainer = styled.div`
  background: var(--purple);
  overflow: hidden;
  height: ${window.innerHeight}px;

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  color: white;
  font-size: 1.4rem;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
`;

const GameplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 55vh;
  width: ${smMin};

  @media (max-width: ${smMin}) {
    width: 75vw;
  }

  & > * {
    margin: 0.3rem 0;
    width: 100%;
  }
`;

type QuestionContainerProps = {
  animateCorrect?: boolean;
  animateWrong?: boolean;
};

const QuestionContainer = styled.div`
  background: white;
  border-radius: 15px;
  font-size: 2rem;
  text-align: end;
  color: var(--dark-purple);

  transition: background-color 0.5s ease-out;

  & > * {
    margin: 0.5rem;
  }

  ${({ animateCorrect }: QuestionContainerProps) => animateCorrect
    && css`background-color: var(--green)`};

  ${({ animateWrong }: QuestionContainerProps) => animateWrong
    && css`background-color: var(--pink)`};
`;

const InputDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled.input`
  background: none;
  text-align: end;
  font-size: 2rem;
  width: 13rem;
`;

const QuestionDisplay = styled.span`
  font-family: var(--primary-font), sans-serif;
  font-size: 3rem;
`;

const ScoreSection = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;

  & > * {
    margin: 0 0.25rem;
  }
`;

const BigText = styled.span`
  font-size: 2.5rem;
`;

const MentalSumsGame: React.FC<MentalSumsGameProps> = ({
  incrementScore, score, seed, timeLeft,
}) => {
  const { problemText, expectedAns, nextProblem } = useQuestionStream(seedrandom(seed));
  const [animateCorrect, setAnimateCorrect] = useState(false);
  const [animateWrong, setAnimateWrong] = useState(false);
  const [input, setInput] = useState('');

  const setCorrect = () => {
    setAnimateCorrect(true);
    setTimeout(() => setAnimateCorrect(false), 500);
  };

  const setWrong = () => {
    setAnimateWrong(true);
    setTimeout(() => setAnimateWrong(false), 500);
  };

  const checkAns = (newInput: string) => {
    if (expectedAns === null) return;
    if (newInput.length < expectedAns.toString().length) return;
    if (parseInt(newInput, 10) === expectedAns) {
      setCorrect();
      incrementScore();
    } else {
      setWrong();
    }
    nextProblem();
    setInput('');
  };

  return (
    <GameContainer>
      <TimerDisplay seconds={timeLeft} />
      <GameplayContainer>
        <QuestionContainer
          animateCorrect={animateCorrect}
          animateWrong={animateWrong}
        >
          <QuestionDisplay>
            {problemText}
          </QuestionDisplay>
          <InputDiv>
            <span>=</span>
            <StyledInput
              onChange={(e) => {
                const newInput = e.target.value.replace(/[^0-9-]/g, '');
                setInput(newInput);
                checkAns(newInput);
              }}
              value={input}
              name="answer-field"
              type="text"
              autoFocus
              readOnly
            />
          </InputDiv>
        </QuestionContainer>
        <NumKeypad
          onClickKey={(key) => {
            const newInput = input + key;
            setInput(newInput);
            checkAns(newInput);
          }}
        />
      </GameplayContainer>
      <ScoreSection>
        <BigText>{score}</BigText> Solved
      </ScoreSection>
    </GameContainer>
  );
};

export default MentalSumsGame;
