import React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'react-feather';
import smoothscroll from 'smoothscroll-polyfill';

const ScrollDownPrompt = styled.button`
  position: absolute;
  bottom: 0px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 1rem;

  & > svg {
    width: 2rem;
    height: 2rem;
  }
`;

type ScrollDownButtonProps = {
  promptText?: string;
  scrollToRef: React.RefObject<HTMLDivElement>;
};

const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({
  promptText,
  scrollToRef,
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
    <ScrollDownPrompt onClick={scrollRefIntoView}>
      {promptText}
      <ChevronDown />
    </ScrollDownPrompt>
  );
};

export default ScrollDownButton;
