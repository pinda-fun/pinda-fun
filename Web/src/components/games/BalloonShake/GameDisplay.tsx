import React from 'react';
import styled from 'styled-components';
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

const TimerSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const TimerText = styled.h1`
  font-size: 6rem;
  color: white;
  text-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
  margin: 0;
  letter-spacing: 0.3rem;

  // Increase line-height to curb font rendering bug
  line-height: 1.2;
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
    <TimerSection>
      <span>Time left:</span>
      <TimerText>{secondsLeft}</TimerText>
    </TimerSection>
    <BalloonContainer>
      <Balloon width={count * 3 + 50} />
    </BalloonContainer>
    <ShakeCountSection>
      <BigText>{count}</BigText> Shakes
    </ShakeCountSection>
  </GameContainer>
);

export default GameDisplay;
