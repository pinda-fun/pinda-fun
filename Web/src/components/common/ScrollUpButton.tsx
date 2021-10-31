import React from 'react';
import styled from 'styled-components/macro';
import { ChevronUp } from 'react-feather';

type ScrollUpDisplayProps = {
  color?: string;
  backgroundColor?: string;
  sticky?: boolean;
};

const ScrollUpPrompt = styled.button`
  position: absolute;
  width: 100%;
  top: 0;
  font-size: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 999;

  color: ${({ color }: ScrollUpDisplayProps) => color || 'black'};
  background-color: ${({ backgroundColor }: ScrollUpDisplayProps) => backgroundColor || 'transparent'};

  ${({ sticky }: ScrollUpDisplayProps) => sticky && 'position: sticky;'};

  & > svg {
    width: 2rem;
    height: 2rem;
  }
`;

type ScrollUpButtonProps = {
  promptText?: string;
  scrollToRef: React.RefObject<HTMLDivElement>;
  color?: string;
  backgroundColor?: string;
  sticky?: boolean;
};

const ScrollUpButton: React.FC<ScrollUpButtonProps> = ({
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
    <ScrollUpPrompt
      onClick={scrollRefIntoView}
      color={color}
      backgroundColor={backgroundColor}
      sticky={sticky}
    >
      <ChevronUp />
      {promptText}
    </ScrollUpPrompt>
  );
};

export default ScrollUpButton;
