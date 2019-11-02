import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import CommContext from 'components/room/comm/CommContext';

const Container = styled.div`
  background: var(--pale-purple);
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Result = styled.h2`
  font-size: 6rem;
  color: var(--purple);
  margin: 1rem 0 0 0;
  justify-content: center;
`;

const GameResults: React.FC<{ finalCount: number }> = ({ finalCount }) => {
  const comm = useContext(CommContext);
  useEffect(() => comm.sendResult([finalCount]), [finalCount, comm]);
  return (
    <Container>
      <h2>Your Score:</h2>
      <Result>{finalCount}</Result>
    </Container>
  );
};

export default GameResults;
