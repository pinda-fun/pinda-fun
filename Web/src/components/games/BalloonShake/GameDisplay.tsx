import React from 'react';
import styled from 'styled-components';
import { ReactComponent as BalloonSVG } from 'svg/balloon.svg';

interface IProps {
  secondsLeft: number;
  count: number;
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

const Balloon = styled(BalloonSVG)`
  display: flex;
  position: absolute;
  justify-content: center;
  z-index: 0;
`;

const TimeLeft = styled.h2`
  font-size: 6rem;
  color: var(--purple);
  margin: 0 0 0 0;
  justify-content: center;

  // Increase line-height to curb font rendering bug
  line-height: 1.2;
`;

const ShakeCount = styled.h3`
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;

  // Increase line-height to curb font rendering bug
  line-height: 1.2;
`;

const GameDisplay: React.FC<IProps> = ({ secondsLeft, count }) => (
  <GameContainer>
    <Balloon width={count * 3 + 50} />
    <h2>Time Left:</h2>
    <TimeLeft>
      {secondsLeft}
    </TimeLeft>
    <ShakeCount>
      {count}
    </ShakeCount>
    <h2>Shakes so far</h2>
  </GameContainer>
);

export default GameDisplay;
