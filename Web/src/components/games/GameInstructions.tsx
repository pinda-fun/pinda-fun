import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { smMin } from 'utils/media';

const InstructionsDiv = styled.div`
  background-color: var(--deep-purple);
  color: white;
  min-height: ${window.innerHeight}px;
  text-align: center;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    text-shadow: 3px 3px 0 var(--dark-purple);
    font-size: 1.2rem;
    width: ${smMin};

    @media (max-width: ${smMin}) {
      width: 85vw;
    }
  }

  svg {
    height: 14em;
  }
`;

const GameTitle = styled.h1`
  font-size: 2.8rem;
  text-shadow: 4px 4px 0 var(--dark-purple);
  margin-bottom: 0;
`;

const InstructionsTitle = styled.h2`
  font-size: 1.4rem;
  font-family: var(--primary-font);
  font-weight: normal;
  text-shadow: 3px 3px 0 var(--dark-purple);
  margin-bottom: 0;
`;

type GameInstructionsProps = {
  title: string;
  seconds?: number;
  onComplete?: () => void;
};

const GameInstructions: React.FC<GameInstructionsProps> = ({
  children,
  title,
  seconds,
  onComplete,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete();
      return undefined;
    }

    if (seconds == null) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, seconds * 1000);
    return () => clearTimeout(timer);
  }, [isCompleted, onComplete, seconds]);

  return (
    <InstructionsDiv>
      <GameTitle>{title}</GameTitle>
      <InstructionsTitle>Instructions:</InstructionsTitle>
      {children}
    </InstructionsDiv>
  );
};

export default GameInstructions;
