import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { bounce } from 'react-animations';
import { ReactComponent as FlowerPotSVG } from 'svg/flower-pot.svg';
import { ReactComponent as PandaHeadSVG } from 'svg/panda-head-flower.svg';

const PandaPotContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;

  & > * {
    position: absolute;
    bottom: 0px;
    width: 100%:
  }
`;

const FlowerPot = styled(FlowerPotSVG)`
  // We want flower pot to be in front of panda head all the time
  z-index: 1;
`;

interface PandaHeadProps extends React.ComponentProps<typeof PandaHeadSVG> {
  duration?: number,
  isSelected?: boolean,
}

/**
 * Wrapper to remove custom DOM attributes before rendering HTML DOM
 * See: https://www.styled-components.com/docs/faqs#why-am-i-getting-html-attribute-warnings
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PandaHead = ({ duration, isSelected, ...props }: PandaHeadProps) => (
  <PandaHeadSVG {...props} />
);

interface DisplayProps extends PandaHeadProps {
  duration: number,
}

interface InputProps extends PandaHeadProps {
  isSelected: boolean,
}

const DisplayPandaHead = styled(PandaHead)`
  ${({ duration }: DisplayProps) => duration !== 0
    && css`
      animation: ${duration / 1000}s ${keyframes`${bounce}`} ease-in-out infinite;
    `};
`;

// touch-action set to none to inform chrome that no scrolling is performed on this element,
// preventing it from setting the event as passive by default, which would in turn stop us
// from calling preventDefault() to curb propagation of touch events to mouse events
const InputPandaPotContainer = styled.div`
  width: ${({ isSelected }: InputProps) => (isSelected ? '50%' : '100%')}
  touch-action: none;
  transition: 0.1s;
  cursor: pointer;
`;

const DisplayPandaPot: React.FC<DisplayProps> = ({ duration }) => (
  <PandaPotContainer>
    <DisplayPandaHead duration={duration} />
    <FlowerPot />
  </PandaPotContainer>
);

const InputPandaPot: React.FC<InputProps> = ({ isSelected }) => (
  <InputPandaPotContainer isSelected={isSelected}>
    <PandaPotContainer>
      <PandaHead />
      <FlowerPot />
    </PandaPotContainer>
  </InputPandaPotContainer>
);

export {
  DisplayPandaPot,
  InputPandaPot,
};
