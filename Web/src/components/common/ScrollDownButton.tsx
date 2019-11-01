import React from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown } from 'react-feather';
import smoothscroll from 'smoothscroll-polyfill';

type ScrollDownDisplayProps = {
  backgroundColor?: string;
  sticky: boolean;
}

const ScrollDownPrompt = styled.button`
  position: absolute;
  bottom: 0px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 1rem;

  background-color: ${({ backgroundColor }: ScrollDownDisplayProps) => backgroundColor || 'transparent'};

  ${({ sticky }: ScrollDownDisplayProps) => sticky
    && css`
      position: sticky;
      bottom: 0;
      width: 100%;
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
  sticky=false,
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
