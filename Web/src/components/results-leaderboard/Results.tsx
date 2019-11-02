import React from 'react';
import styled from 'styled-components/macro';
import { ChevronDown, Icon } from 'react-feather';

interface ResultsProps {
  score: number,
  gameText: string,
  rank: number | string,
  numPlayers: number,
}

const Container = styled.div`
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

const Footer = styled.div`
  width: 100vw;
  align-items: center;
  position: sticky;
  bottom: 0;
  text-align: center;
  padding: 12px;
  font-size: 1rem;
`;

const DownArrowIcon = styled(ChevronDown as React.FC<React.ComponentProps<Icon>>)`
  width: 42px;
  height: 42px;
`;

const Results: React.FC<ResultsProps> = ({
  score, gameText, rank, numPlayers,
}) => (
  <Container>
    <Group>
      <BigNumber>{score}</BigNumber>
      <span>{gameText}</span>
    </Group>
    <Group>
      <span>That&apos;s</span>
      <BigNumber>{rank}</BigNumber>
      <span>out of {numPlayers} of your friends!</span>
    </Group>
    <Footer>
      <div>Leaderboard</div>
      <DownArrowIcon />
    </Footer>
  </Container>
);

export default Results;
