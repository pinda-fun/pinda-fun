import React from 'react';
import styled from 'styled-components';
import { ChevronDown, Icon } from 'react-feather';
import { Container, Group } from './Containers';

interface ResultsProps {
  score:number,
  gameText:string,
  rank:number,
  numPlayers:number,
}

const BigNumber = styled.span`
  height: auto;
  font-size: 10rem;
  font-family: var(--secondary-font);
  text-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.div`
  width: 100vw;
  align-items: center;
  position: sticky;
  bottom: 0px;
  text-align: center;
  padding: 12px;
  font-size: 1rem;
`;

const DownArrowIcon = styled(ChevronDown as React.FC<React.ComponentProps<Icon>>)`
  width: 42px;
  height: 42px;
`;

const Results: React.FC<ResultsProps> = (
  {
    score, gameText, rank, numPlayers,
  },
) => (
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
