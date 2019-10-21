import { keyframes } from 'styled-components';

export const blink = keyframes`
  0% {
    opacity: 0%;
  }
  50% {
    opacity: 50%;
  }
  100% {
    opacity: 0%;
  }
`;
