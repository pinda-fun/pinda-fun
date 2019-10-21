import React from 'react';
import styled from 'styled-components';

const TimerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: baseline;

  & > * {
    margin: 0 0.25rem;
  }
`;

const TimerText = styled.span`
  font-size: 6rem;
  font-family: var(--secondary-font);
  text-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3rem;
  margin: 0;

  // Increase line-height to curb font rendering bug
  line-height: 1.2;
`;

const UnitsText = styled.span`
  font-size: 2rem;
  font-family: var(--secondary-font);
`;

type TimerProps = {
  seconds: number;
};

const TimerDisplay: React.FC<TimerProps> = ({ seconds }) => (
  <TimerDiv>
    <span>Time left:</span>
    <div>
      <TimerText>{seconds}</TimerText>
      <UnitsText> sec</UnitsText>
    </div>
  </TimerDiv>
);

export default TimerDisplay;
