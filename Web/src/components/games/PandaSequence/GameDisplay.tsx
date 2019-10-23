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
  background: ${props => props.theme.background};
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Balloon = styled(BalloonSVG)`
  display: flex;
  width: 70;
`;

const Score = styled.h3`
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const balloons = [0, 1, 2, 3, 4];

const GameDisplay: React.FC<IProps> = ({
  mode, secondsLeft, score, active, handleInputEvent,
}) => {
  const onTap = (index:number) => {
    // TODO: Animate tapped component to confirm user input
    handleInputEvent(index);
  };

  return (
    <ThemeProvider theme={mode === PandaSequenceMode.INPUT ? InputTheme : DisplayTheme}>
      <GameContainer>
        <TimerDisplay seconds={secondsLeft} />
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
