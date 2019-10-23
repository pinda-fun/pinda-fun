import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import TimerDisplay from 'components/games/TimerDisplay';
import { ReactComponent as BalloonSVG } from 'svg/balloon.svg';
import { PandaSequenceMode } from './Sequence';

interface IProps {
  mode: PandaSequenceMode,
  secondsLeft: number,
  score: number,
  handleInputEvent:(input:number) => void,
  active?: number,
}

const DisplayTheme = {
  background: 'var(--pale-yellow)',
};

const InputTheme = {
  background: 'var(--pale-purple)',
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

const Balloon = styled(BalloonSVG)`
  width: 70px;
  margin: 12px;
`;

const Score = styled.h3`
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const GameDisplay: React.FC<IProps> = ({
  mode, secondsLeft, score, active, handleInputEvent,
}) => {
  const onTap = (index:number) => {
    // TODO: Animate tapped component to confirm user input
    handleInputEvent(index);
  };

  let balloons;
  if (mode === PandaSequenceMode.DISPLAY) {
    balloons = Array.from(Array(5).keys()).map((i) => <Balloon key={i} style={{ width: active === i ? '100px' : '70px' }} />);
  } else {
    balloons = Array.from(Array(5).keys()).map((i) => <Balloon key={i} onClick={() => onTap(i)} />);
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
