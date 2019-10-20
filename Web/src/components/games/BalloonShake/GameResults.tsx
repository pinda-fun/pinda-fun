import React from 'react';
import styled from 'styled-components';

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
  z-index: 1;
`;

const GameResults: React.FC<{ finalCount: number }> = ({ finalCount }) => (
  <Container>
    <h2>You shook:</h2>
    <Result>{finalCount}</Result>
    <h2>times!</h2>
  </Container>
);

export default GameResults;
