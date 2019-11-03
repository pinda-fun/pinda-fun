import React from 'react';
import styled from 'styled-components/macro';
import { CommError } from './comm/Errors';

const ErrorContainer = styled.div`
  margin: 10px;
  background: var(--red);
  border: white;
  border-radius: 0.8rem;
  border-style: dashed;
`;

const ErrorText = styled.p`
  color: white;
  margin: 6px;
`;

const ErrorTitleText = styled(ErrorText)`
  font-weight: bold;
`;

interface ErrorDisplayProps {
  error: CommError | null;
  errorDescription: string | null;
}

interface TitleMessage {
  title: string;
  message?: string;
}

const titleMessageMapping: Record<CommError, TitleMessage> = {
  [CommError.NoMorePin]: {
    title: 'No rooms left',
    message: 'Please try again later.',
  },
  [CommError.RoomNotAccepting]: {
    title: 'Room is currently in-game',
    message: 'The game is ending soon - please try again later!',
  },
  [CommError.Timeout]: {
    title: 'Connection timed out',
    message: 'Please check your connection and try again.',
  },
  [CommError.Other]: {
    title: 'Something bad happened',
  },
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error, errorDescription,
}) => {
  if (error === null) return null;
  const { title, message = errorDescription } = titleMessageMapping[error];
  return (
    <ErrorContainer>
      <ErrorTitleText>
        {title}
      </ErrorTitleText>
      <ErrorText>
        {message}
      </ErrorText>
    </ErrorContainer>
  );
};

export default ErrorDisplay;
