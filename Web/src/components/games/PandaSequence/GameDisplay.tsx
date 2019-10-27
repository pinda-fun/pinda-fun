import React, { useState } from 'react';
import styled, { keyframes, ThemeProvider, css } from 'styled-components';
import TimerDisplay from 'components/games/TimerDisplay';
import { ReactComponent as BalloonSVG } from 'svg/balloon.svg';
import { blinkRed, blinkGreen } from 'utils/animations';
import { wobble } from 'react-animations';
import { PandaSequenceMode } from './Sequence';

interface IProps {
  mode: PandaSequenceMode,
  secondsLeft: number,
  score: number,
  isLastInSequence:() => boolean;
  processInput:(input:number) => boolean,
  timestep: number,
  displaying?: number,
}

enum Feedback {
  NONE,
  CORRECT,
  WRONG,
}

const DisplayTheme = {
  background: 'var(--pale-yellow)',
};

const InputTheme = {
  background: 'var(--pale-purple)',
};

interface GameContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  feedbackState:Feedback;
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
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  color: black;
  font-size: 1.4rem;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);

  ${({ feedbackState }:GameContainerProps) => (feedbackState === Feedback.CORRECT && css`animation: ${blinkGreen} 0.5s ease-in-out 0s 1;`)
    || (feedbackState === Feedback.WRONG && css`animation: ${blinkRed} 0.5s ease-in-out 0s 1;`)
};
`;

interface BalloonSVGElementProps extends React.ComponentProps<typeof BalloonSVG> {
  duration?: number,
  isSelected?: boolean,
}

/**
 * Wrapper to remove custom DOM attributes before rendering HTML DOM
 * See: https://www.styled-components.com/docs/faqs#why-am-i-getting-html-attribute-warnings
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BalloonSVGElement = ({ duration, isSelected, ...props }: BalloonSVGElementProps) => (
  <BalloonSVG {...props} />
);

interface DisplayBalloonProps extends BalloonSVGElementProps {
  duration: number,
}

interface InputBalloonProps extends BalloonSVGElementProps {
  isSelected: boolean,
}

const DisplayBalloon = styled(BalloonSVGElement)`
  width: 70px;
  margin: 12px;
  ${({ duration }:DisplayBalloonProps) => duration !== 0
    && css`
    animation: ${duration / 1000}s ${keyframes`${wobble}`} ease-in-out infinite;
  `};
`;

// touch-action set to none to inform chrome that no scrolling is performed on this element,
// preventing it from setting the event as passive by default, which would in turn stop us
// from calling preventDefault() to curb propagation of touch events to mouse events
const InputBalloon = styled(BalloonSVGElement)`
  width: ${({ isSelected }:InputBalloonProps) => (isSelected ? '100px' : '70px')}
  margin: 12px;
  touch-action: none;
`;

const BalloonContainer = styled.div`
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content:space-evenly;
`;

const Score = styled.h3`
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

/**
 * This component handles both display and input mode.
 * Display Mode: Element in sequence is animated according to "displaying" prop
 * Input Mode: Element tapped is animated based on "selected" state
 */
const GameDisplay: React.FC<IProps> = ({
  mode, secondsLeft, score, isLastInSequence, processInput, timestep, displaying,
}) => {
  const [selected, setSelected] = useState(Array(5).fill(false));
  const [feedback, setFeedback] = useState<Feedback>(Feedback.NONE);

  const handleTouch = (event: React.SyntheticEvent, index:number) => {
    event.preventDefault();
    setSelected((oldSelected) => Object.assign([], oldSelected, { [index]: true }));
  };

  const handleTouchEnd = (event: React.SyntheticEvent, index:number) => {
    event.preventDefault();

    // check if sequence has reached end before processing input
    const isLast = isLastInSequence();
    if (processInput(index)) {
      if (isLast) {
        setFeedback(Feedback.CORRECT);
      }
    } else {
      setFeedback(Feedback.WRONG);
    }

    setSelected((oldSelected) => Object.assign([], oldSelected, { [index]: false }));
  };

  let balloons;
  if (mode === PandaSequenceMode.DISPLAY) {
    balloons = Array(5).fill(null).map((_, index) => (
      <DisplayBalloon
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        duration={displaying === index ? timestep : 0}
      />
    ));
  } else {
    balloons = Array(5).fill(null).map((_, index) => (
      <InputBalloon
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        onTouchStart={(event: React.SyntheticEvent) => handleTouch(event, index)}
        onTouchEnd={(event: React.SyntheticEvent) => handleTouchEnd(event, index)}
        onMouseDown={(event: React.SyntheticEvent) => handleTouch(event, index)}
        onMouseUp={(event: React.SyntheticEvent) => handleTouchEnd(event, index)}
        isSelected={selected[index]}
      />
    ));
  }

  return (
    <ThemeProvider theme={mode === PandaSequenceMode.INPUT ? InputTheme : DisplayTheme}>
      <GameContainer
        feedbackState={feedback}
        onAnimationEnd={() => setFeedback(Feedback.NONE)}
      >
        <TimerDisplay seconds={secondsLeft} />
        <BalloonContainer>
          {balloons.slice(0, 3)}
        </BalloonContainer>
        <BalloonContainer>
          {balloons.slice(3, 5)}
        </BalloonContainer>
        <Score>
          {score}
        </Score>
        <h2>Score</h2>
      </GameContainer>
    </ThemeProvider>
  );
};

export default GameDisplay;
