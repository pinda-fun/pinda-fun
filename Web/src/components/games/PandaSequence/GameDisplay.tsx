import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
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
  background: ${props => props.theme.background};
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

const Balloon = styled(BalloonSVG)`
  display: flex;
  width: 70;
  z-index: 0;
`;

const TimeLeft = styled.h2`
  font-size: 6rem;
  color: var(--purple);
  margin: 0 0 0 0;
  justify-content: center;
  padding-top: 6px;
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
    handleInputEvent(index);
  };

  const balloons = [0, 1, 2, 3, 4];

  return (
    <ThemeProvider theme={mode === PandaSequenceMode.INPUT ? InputTheme : DisplayTheme}>
      <GameContainer>
        <h2>Time Left:</h2>
        <TimeLeft>
          {secondsLeft}
        </TimeLeft>
        {mode === PandaSequenceMode.DISPLAY
          && balloons.map(i => <Balloon key={i} width={active === i ? 100 : 70} />)}
        {mode === PandaSequenceMode.INPUT
          && balloons.map(i => <Balloon key={i} onClick={() => onTap(i)} />)}
        <Score>
          {score}
        </Score>
        <h2>Balloons &quot;popped&quot;</h2>
      </GameContainer>
    </ThemeProvider>
  );
};

export default GameDisplay;
