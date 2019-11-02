import React from 'react';
import styled, { css } from 'styled-components/macro';
import { ChevronDown } from 'react-feather';
import smoothscroll from 'smoothscroll-polyfill';

type ScrollDownDisplayProps = {
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

  background-color: ${({ backgroundColor }: ScrollDownDisplayProps) => backgroundColor || 'transparent'};

  ${({ sticky }: ScrollDownDisplayProps) => sticky
    && css`
      position: sticky;
    `};

  & > svg {
    width: 2rem;
    height: 2rem;
  }
`;

type ScrollDownButtonProps = {
  promptText?: string;
  scrollToRef: React.RefObject<HTMLDivElement>;
  backgroundColor?: string;
  sticky?: boolean;
};

const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({
  promptText,
  scrollToRef,
  backgroundColor,
  sticky = false,
}) => {
  const scrollRefIntoView = () => {
    if (scrollToRef.current != null) {
      smoothscroll.polyfill();
      scrollToRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <ScrollDownPrompt
      onClick={scrollRefIntoView}
      backgroundColor={backgroundColor}
      sticky={sticky}
    >
      {promptText}
      <ChevronDown />
    </ScrollDownPrompt>
  );
};

export default ScrollDownButton;
