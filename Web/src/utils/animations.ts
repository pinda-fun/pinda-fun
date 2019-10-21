import { keyframes } from 'styled-components';

export const blinkRed = keyframes`
  0% {
    background: rgba(var(--red-rgb), 0);
  }
  50% {
    background: rgba(var(--red-rgb), 0.6);
  }
  100% {
    background: rgba(var(--red-rgb), 0);
  }
`;

export const blinkGreen = keyframes`
  0% {
    background: rgba(var(--green-rgb), 0);
  }
  50% {
    background: rgba(var(--green-rgb), 0.6);
  }
  100% {
    background: rgba(var(--green-rgb), 0);
  }
`;
