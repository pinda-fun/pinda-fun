import React, { RefObject } from 'react';
import styled from 'styled-components/macro';
import ScrollDownButton from 'components/common/ScrollDownButton';

interface ResultsProps {
  pageTopRef: RefObject<HTMLDivElement>,
  scrollToRef: React.RefObject<HTMLDivElement>,
  score: number,
  gameText: string,
  rank: number | string,
  numPlayers: number,
}

const Container = styled.section`
  background: var(--green);
  position: relative;
  overflow: hidden;
  height: ${window.innerHeight}px;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  color: white;
  font-size: 1.4rem;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Group = styled.span`
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const BigNumber = styled.span`
  height: auto;
  font-size: 8rem;
  font-family: var(--secondary-font);
  margin: 1rem 0 -1rem 0;
  text-shadow: 10 10 0 rgba(0, 0, 0, 0.1);
`;

const Results: React.FC<ResultsProps> = ({
  pageTopRef, scrollToRef, score, gameText, rank, numPlayers,
}) => (
  <Container ref={pageTopRef}>
    <Group>
      <BigNumber>{score}</BigNumber>
      <span>{gameText}</span>
    </Group>
    <Group>
      <span>That&apos;s</span>
      <BigNumber>{rank}</BigNumber>
      <span>out of {numPlayers} of your friends!</span>
    </Group>
    <ScrollDownButton
      promptText="Leaderboard"
      scrollToRef={scrollToRef}
      color="white"
      backgroundColor="var(--green)"
      sticky={false}
    />
  </Container>
);

export default Results;
