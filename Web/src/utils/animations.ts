import { keyframes } from 'styled-components/macro';

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

export const jump = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-30%);
  }

  100% {
    transform: translateY(0);
  }
`;
