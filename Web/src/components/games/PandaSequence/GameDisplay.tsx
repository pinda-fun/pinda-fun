import React, { useState, useEffect } from 'react';
import styled, { keyframes, ThemeProvider, css } from 'styled-components';
import TimerDisplay from 'components/games/TimerDisplay';
import { ReactComponent as BalloonSVG } from 'svg/balloon.svg';
import { wobble } from 'react-animations';
import { PandaSequenceMode } from './Sequence';

interface IProps {
  mode: PandaSequenceMode,
  secondsLeft: number,
  score: number,
  processInput:(input:number) => void,
  timestep: number,
  displaying?: number,
}

const DisplayTheme = {
  background: 'var(--pale-yellow)',
  animateDuration: 'infinite',
};

const InputTheme = {
  background: 'var(--pale-purple)',
  animateDuration: '1',
};

const GameContainer = styled.div`
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
`;

const BalloonContainer = styled.div`
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content:space-evenly;
`;

const WobbleAnimation = keyframes`${wobble}`;

const Balloon = styled(BalloonSVG)`
  width: 70px;
  margin: 12px;
  animation: ${(tags: {duration: number}) => (tags.duration === 0
    ? undefined : css`${tags.duration / 1000}s ${WobbleAnimation} ease-in-out ${(props) => props.theme.animateDuration};`)}
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
  mode, secondsLeft, score, processInput, timestep, displaying,
}) => {
  const [selected, setSelected] = useState(Array(5).fill(false));

  useEffect(() => {
    if (mode === PandaSequenceMode.INPUT) {
      setSelected(Array(5).fill(false));
    }
  }, [mode]);

  const handleClick = (index:number) => {
    setSelected((oldClicked) => Object.assign([], oldClicked, { [index]: true }));
  };

  const handleAnimationEnd = (index:number) => {
    processInput(index);
    setSelected(Object.assign([], selected, { [index]: false }));
  };

  let balloons;
  if (mode === PandaSequenceMode.DISPLAY) {
    balloons = Array.from(Array(5).keys()).map((index) => (
      <Balloon
        key={index}
        duration={displaying === index ? timestep : 0}
      />
    ));
  } else {
    balloons = Array.from(Array(5).keys()).map((index) => (
      <Balloon
        key={index}
        duration={selected[index] ? timestep : 0}
        onClick={() => handleClick(index)}
        onAnimationEnd={() => handleAnimationEnd(index)}
      />
    ));
  }

  return (
    <ThemeProvider theme={mode === PandaSequenceMode.INPUT ? InputTheme : DisplayTheme}>
      <GameContainer>
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
        <h2>Balloons &quot;popped&quot;</h2>
      </GameContainer>
    </ThemeProvider>
  );
};

export default GameDisplay;
