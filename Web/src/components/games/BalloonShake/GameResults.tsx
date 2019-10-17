import React, { FC } from 'react';
import { mdMin } from 'utils/media';
import styled from 'styled-components';

const Container = styled.div`
    background: var(--pale-purple);
    position: relative;
    overflow: hidden;
    height: 100%;
`;

const Section = styled.div`
  display: flex;
  justify-content: center;
  padding: 7rem 1rem;
  flex-direction: column;
  align-items: center;

  & > div {
  width: ${mdMin};

  @media (max-width: ${mdMin}) {
    width: calc(100% - 0.5em);
    }
  }
`;

const Result = styled.h2`
    font-size: 6rem;
    color: var(--purple);
    margin: 1rem 0 0 0;
    justify-content: center;
    z-index: 1;
`;

const GameResults: FC<{ finalCount: number }> = ({ finalCount }) => (
  <Container>
    <Section>
      <h2>You shook:</h2>
      <Result>{finalCount}</Result>
      <h2>times!</h2>
    </Section>
  </Container>
)

export default GameResults;
