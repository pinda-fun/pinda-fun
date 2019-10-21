import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { ReactComponent as BalloonSVG } from 'svg/balloon.svg';
import { PandaSequenceMode } from './Sequence';

interface IProps {
  mode: PandaSequenceMode,
  secondsLeft: number,
  score: number,
  active: number,
  handleInputEvent:(input:number) => void,
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
  // position: absolute;
  // justify-content: center;
  z-index: 0;
`;

const TimeLeft = styled.h2`
  font-size: 6rem;
  color: var(--purple);
  margin: 0 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const ShakeCount = styled.h3`
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  padding-top: 6px;
`;

const SequenceDisplay: React.FC<IProps> = ({
  mode, secondsLeft, score, active, handleInputEvent,
}) => {
  const onTap = (index:number) => {
    handleInputEvent(index);
  };

  return (
    <ThemeProvider theme={mode === PandaSequenceMode.INPUT ? InputTheme : DisplayTheme}>
      <GameContainer>
        <h2>Time Left:</h2>
        <TimeLeft>
          {secondsLeft}
        </TimeLeft>
        {mode === PandaSequenceMode.DISPLAY && (
          <>
            <Balloon width={active === 0 ? 100 : 70} />
            <Balloon width={active === 1 ? 100 : 70} />
            <Balloon width={active === 2 ? 100 : 70} />
            <Balloon width={active === 3 ? 100 : 70} />
            <Balloon width={active === 4 ? 100 : 70} />
          </>
        )}
        {mode === PandaSequenceMode.INPUT && (
          <>
            <Balloon width="70" onClick={() => onTap(0)} />
            <Balloon width="70" onClick={() => onTap(1)} />
            <Balloon width="70" onClick={() => onTap(2)} />
            <Balloon width="70" onClick={() => onTap(3)} />
            <Balloon width="70" onClick={() => onTap(4)} />
          </>
        )}
        <ShakeCount>
          {score}
        </ShakeCount>
        <h2>Balloons &quot;popped&quot;</h2>
      </GameContainer>
    </ThemeProvider>
  );
};

export default SequenceDisplay;
