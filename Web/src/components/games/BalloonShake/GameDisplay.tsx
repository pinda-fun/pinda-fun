import React from 'react';
import styled from 'styled-components';
import TimerDisplay from 'components/games/TimerDisplay';
import { ReactComponent as Balloon } from 'svg/balloon.svg';

interface IProps {
  secondsLeft: number;
  count: number;
}

const GameContainer = styled.div`
  background: var(--pink);
  overflow: hidden;
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;

  color: white;
  font-size: 1.4rem;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);

  & > * {
    z-index: 1;
  }
`;

const BalloonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 55vh;
  z-index: 0;
`;

const ShakeCountSection= styled.section`
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

const GameDisplay: React.FC<IProps> = ({ secondsLeft, count }) => (
  <GameContainer>
    <TimerDisplay seconds={secondsLeft} />
    <BalloonContainer>
      <Balloon width={count * 3 + 50} />
    </BalloonContainer>
    <ShakeCountSection>
      <BigText>{count}</BigText> Shakes
    </ShakeCountSection>
  </GameContainer>
);

export default GameDisplay;
