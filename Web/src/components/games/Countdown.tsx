import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CountdownDiv = styled.div`
  background-color: var(--yellow);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Text = styled.h1`
  font-size: 12rem;
  color: white;
  text-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);

  // Add padding to curb font rendering bug
  padding-top: 8px;
`;

type CountdownProps = {
  seconds: number;
  onComplete: () => void;
};

const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
  const [count, setCount] = useState(seconds);
  let display = count.toString();
  if (count === 0) {
    display = 'GO';
  }

  useEffect(() => {
    /* eslint-disable consistent-return */
    if (count < 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setCount(count - 1);
    }, 1000);
    return () => clearInterval(intervalId);
    /* eslint-enable consistent-return */
  }, [count]);

  return (
    <CountdownDiv>
      <Text>{display}</Text>
    </CountdownDiv>
  );
};

export default Countdown;
