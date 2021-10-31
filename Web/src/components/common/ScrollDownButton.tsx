import React from 'react';
import styled from 'styled-components/macro';
import { ChevronDown } from 'react-feather';

type ScrollDownDisplayProps = {
  color?: string;
  backgroundColor?: string;
  sticky?: boolean;
};

const ScrollDownPrompt = styled.button`
  position: absolute;
  width: 100%;
  bottom: 0;
  font-size: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 999;

  color: ${({ color }: ScrollDownDisplayProps) => color || 'black'};
  background-color: ${({ backgroundColor }: ScrollDownDisplayProps) => backgroundColor || 'transparent'};

  ${({ sticky }: ScrollDownDisplayProps) => sticky && 'position: sticky;'};

  & > svg {
    width: 2rem;
    height: 2rem;
  }
`;

type ScrollDownButtonProps = {
  promptText?: string;
  scrollToRef: React.RefObject<HTMLDivElement>;
  color?: string;
  backgroundColor?: string;
  sticky?: boolean;
};

const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({
  promptText,
  scrollToRef,
  color,
  backgroundColor,
  sticky = false,
}) => {
  const scrollRefIntoView = () => {
    if (scrollToRef.current != null) {
      scrollToRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <ScrollDownPrompt
      onClick={scrollRefIntoView}
      color={color}
      backgroundColor={backgroundColor}
      sticky={sticky}
    >
      {promptText}
      <ChevronDown />
    </ScrollDownPrompt>
  );
};

export default ScrollDownButton;
