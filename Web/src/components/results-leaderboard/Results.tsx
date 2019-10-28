import React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'react-feather';
import { VerticalContainer, HorizontalContainer } from './Containers';

interface ResultsProps {
  score:number,
  gameText:string,
  rank:number,
  numPlayers:number,
}

const BigNumber = styled.span`
  font-size: 10rem;
  font-family: var(--secondary-font);
  text-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: sticky;
  bottom: 0px;
  text-align: center;
  padding: 12px;
  font-size: 1rem;
`;

const DownArrowIcon = styled(ChevronDown)`
  width: 42px;
  height: 42px;
  viewBox: 0 0 10 10;
`;

const Results: React.FC<ResultsProps> = (
  {
    score, gameText, rank, numPlayers,
  },
) => (
  <VerticalContainer>
    <HorizontalContainer>
      <BigNumber>{score}</BigNumber>
      <span>{gameText}</span>
    </HorizontalContainer>
    <HorizontalContainer>
      <span>That&apos;s</span>
      <BigNumber>{rank}</BigNumber>
      <span>out of {numPlayers} of your friends!</span>
    </HorizontalContainer>
    <Footer>
      <span>Leaderboard</span>
      <DownArrowIcon />
    </Footer>
  </VerticalContainer>
);

export default Results;
