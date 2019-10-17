import React, { FC } from 'react';
import styled from 'styled-components';
import { mdMin } from 'utils/media';
import { ReactComponent as BalloonSVG } from 'svg/balloon.svg';

interface IProps {
  secondsLeft: number;
  count: number;
}

const GameContainer = styled.div`
  background: var(--pale-yellow);
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;

const Section = styled.div`
  display: flex;
  justify-content: center;
  padding: 7rem 1rem;
  flex-direction: column;
  align-items: center;

  & > div {
    width: ${mdMin};

    @media (max-width: ${mdMin}) {
      width: calc(100% - 0.5em);
    }
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
  margin: 1rem 0 0 0;
  justify-content: center;
  z-index: 1;
`;

const ShakeCount = styled.h3`
  font-size: 4rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
  justify-content: center;
  z-index: 1;
`;

const GameDisplay: FC<IProps> = ({ secondsLeft, count }) => (
  <GameContainer>
    <Section>
      <Balloon width={count * 3 + 50} />
      <h2 style={{ zIndex: 1 }}>Time Left:</h2>
      <TimeLeft>
        {secondsLeft}
      </TimeLeft>
      <ShakeCount>
        {count}
      </ShakeCount>
      <h2 style={{ zIndex: 1 }}>Shakes so far</h2>
    </Section>
  </GameContainer>
);

export default GameDisplay;
