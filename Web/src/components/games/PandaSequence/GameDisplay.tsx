import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components/macro';
import TimerDisplay from 'components/games/TimerDisplay';
import { smMin } from 'utils/media';
import FeedbackModal from './FeedbackModal';
import { PandaSequenceMode, Feedback } from './Sequence';
import { InputPandaPot, DisplayPandaPot } from './PandaPot';

const NUM_POTS = 6;

interface IProps {
  mode: PandaSequenceMode,
  secondsLeft: number,
  score: number,
  processInput: (input: number) => boolean,
  feedback: Feedback,
  timestep: number,
  displaying?: number,
}

const DisplayTheme = {
  background: 'var(--yellow)',
};

const InputTheme = {
  background: 'var(--light-purple)',
};

interface GameContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  feedbackState: Feedback;
}

/**
 * Wrapper to remove custom DOM attributes before rendering HTML DOM
 * See: https://www.styled-components.com/docs/faqs#why-am-i-getting-html-attribute-warnings
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GameContainerElement = ({ feedbackState, ...props }: GameContainerProps) => (
  <div {...props} />
);

const GameContainer = styled(GameContainerElement)`
  background: ${(props) => props.theme.background};
  overflow: hidden;
  height: ${window.innerHeight}px;
  width: 100vw;

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  color: white;
  font-size: 1.4rem;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
`;

const FlowerPotsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  height: 55vh;
  width: ${smMin};

  @media (max-width: ${smMin}) {
    width: 100%;
  }
`;

const FlowerPotDiv = styled.div`
  margin: 0.5em;
  height: 20vh;
  width: calc((100% / 3) - 1em);

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const SeqCountSection = styled.section`
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

/**
 * This component handles both display and input mode.
 * Display Mode: Element in sequence is animated according to "displaying" prop
 * Input Mode: Element tapped is animated based on "selected" state
 */
const GameDisplay: React.FC<IProps> = ({
  mode, secondsLeft, score, processInput, feedback, timestep, displaying,
}) => {
  const [selected, setSelected] = useState(Array(NUM_POTS).fill(false));

  const handleTouch = (event: React.SyntheticEvent, index: number) => {
    event.preventDefault();
    setSelected((oldSelected) => Object.assign([], oldSelected, { [index]: true }));
  };

  const handleTouchEnd = (event: React.SyntheticEvent, index: number) => {
    event.preventDefault();
    processInput(index);
    setSelected((oldSelected) => Object.assign([], oldSelected, { [index]: false }));
  };

  let pots;
  if (mode === PandaSequenceMode.DISPLAY) {
    pots = Array(NUM_POTS).fill(null).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <FlowerPotDiv key={index}>
        <DisplayPandaPot
          duration={displaying === index ? timestep : 0}
        />
      </FlowerPotDiv>
    ));
  } else {
    pots = Array(NUM_POTS).fill(null).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <FlowerPotDiv key={index}>
        <InputPandaPot
          onTouch={(event: React.SyntheticEvent) => handleTouch(event, index)}
          onTouchEnd={(event: React.SyntheticEvent) => handleTouchEnd(event, index)}
          isSelected={selected[index]}
        />
      </FlowerPotDiv>
    ));
  }

  return (
    <ThemeProvider theme={mode === PandaSequenceMode.INPUT ? InputTheme : DisplayTheme}>
      <GameContainer feedbackState={feedback}>
        <TimerDisplay seconds={secondsLeft} />
        <FlowerPotsContainer>
          {pots}
        </FlowerPotsContainer>
        <SeqCountSection>
          <BigText>{score}</BigText> Sequences
        </SeqCountSection>
        <FeedbackModal
          isVisible={feedback !== Feedback.NONE}
          isCorrect={feedback === Feedback.CORRECT}
        />
      </GameContainer>
    </ThemeProvider>
  );
};

export default GameDisplay;
