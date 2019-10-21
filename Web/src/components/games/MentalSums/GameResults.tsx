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
  z-index: 1;
`;

const GameResults: React.FC<{ finalCount: number }> = ({ finalCount }) => (
  <Container>
    <h2>Final Score:</h2>
    <Result>{finalCount}</Result>
  </Container>
);

export default GameResults;
