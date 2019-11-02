import React from 'react';
import styled, { css } from 'styled-components/macro';

const TimerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > * {
    margin: 0 0.25rem;
  }
`;

type TextProps = {
  small?: boolean;
};

const TimerText = styled.span`
  font-size: 6rem;
  font-family: var(--secondary-font);
  text-shadow: 6px 6px 0 rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3rem;
  margin: 0;

  /* Increase line-height to curb font rendering bug */
  line-height: 1.2;

  ${(props: TextProps) => props.small
    && css`font-size: 3.5rem;`};
`;

const UnitsText = styled.span`
  font-size: 2rem;
  font-family: var(--secondary-font);

  ${(props: TextProps) => props.small
    && css`font-size: 1.5rem;`};
`;

type TimerProps = {
  seconds: number;
  small?: boolean;
};

const TimerDisplay: React.FC<TimerProps> = ({ seconds, small }) => (
  <TimerDiv>
    <span>Time left:</span>
    <div>
      <TimerText small={small}>{seconds}</TimerText>
      <UnitsText small={small}> sec</UnitsText>
    </div>
  </TimerDiv>
);

export default TimerDisplay;
