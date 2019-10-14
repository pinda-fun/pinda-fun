import React from 'react';
import styled from 'styled-components';
import BrandText from '../common/BrandText';
import StartNewGameButton from './StartNewGameButton';
import { mdMin } from '../../utils/media';

const ContentDiv = styled.div`
  margin: 0 2rem 0 0;
  display: flex;
  flex-direction: column;

  @media (max-width: ${mdMin}) {
    margin: 1rem 0 0 0;
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 1rem 0 0.5rem 0;
`;

const Subtitle = styled.span`
  font-size: 1.5rem;
`;

const HeaderContent: React.FC = () => (
  <ContentDiv>
    <Subtitle>
      Meet <BrandText />, it’s a
    </Subtitle>
    <Title>DECISION MAKER.</Title>
    <StartNewGameButton />
  </ContentDiv>
);

export default HeaderContent;
