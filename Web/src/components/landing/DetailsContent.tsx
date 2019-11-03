import React from 'react';
import styled from 'styled-components/macro';
import BrandText from '../common/BrandText';
import StartNewGameButton from './StartNewGameButton';

const ContentDiv = styled.div`
  text-align: center;

  & > p {
    font-size: 1.2rem;
  }
`;

const Title = styled.h2`
  font-size: 5rem;
  color: var(--dark-purple);
  margin: 1rem 0 0 0;
`;

const DetailsContent: React.FC = () => (
  <ContentDiv>
    <Title>3</Title>
    <p>
      different mini games to play from, <BrandText /> makes decision making fun
      and enjoyable!
    </p>
    <p>
      What are you waiting for? Make a decision with <BrandText /> now!
    </p>
    <StartNewGameButton />
  </ContentDiv>
);

export default DetailsContent;
