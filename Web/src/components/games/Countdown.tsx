import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createTimerObservable } from './rxhelpers';

const CountdownDiv = styled.div`
  background-color: var(--yellow);
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Text = styled.h1`
  font-size: 10rem;
  color: white;
  text-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);

  // Add padding to curb font rendering bug
  padding-top: 2rem;
`;

type CountdownProps = {
  seconds: number;
  onComplete: () => void;
};

const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
  const [count, setCount] = useState(seconds);
  let display = count.toString();
  if (count === 0) {
    display = 'GO!';
  }

  useEffect(() => {
    const timer = createTimerObservable(count + 1);
    const timerSub = timer.subscribe(
      timeLeft => setCount(timeLeft - 1),
      null,
      onComplete,
    );
    return () => timerSub.unsubscribe();
  }, [count]);

  return (
    <CountdownDiv>
      <Text>{display}</Text>
    </CountdownDiv>
  );
};

export default Countdown;
