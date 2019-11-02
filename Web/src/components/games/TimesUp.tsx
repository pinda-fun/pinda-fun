import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

const TIMES_UP_TIME = 1;

const TimesUpDiv = styled.div`
  background-color: var(--red);
  height: ${window.innerHeight}px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Text = styled.h1`
  font-size: 6rem;
  color: white;
  text-shadow: 10px 10px 0 rgba(0, 0, 0, 0.1);

  /* Increase line-height to curb font rendering bug */
  line-height: 1.2;
`;

type TimesUpProps = {
  onComplete: () => void;
};

const TimesUp: React.FC<TimesUpProps> = ({ onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      onComplete();
      return undefined;
    }

    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, TIMES_UP_TIME * 1000);
    return () => clearTimeout(timer);
  }, [isCompleted, onComplete]);

  return (
    <TimesUpDiv>
      <Text>TIME&apos;S UP!</Text>
    </TimesUpDiv>
  );
};

export default TimesUp;
