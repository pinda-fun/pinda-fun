import React from 'react';
import styled from 'styled-components';
import BrandText from '../common/BrandText';
import StartNewGameButton from './StartNewGameButton';
import { mdMin } from '../../utils/media';

const ContentDiv = styled.div`
  margin: 0 0 0 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: ${mdMin}) {
    margin: 0;
    align-items: center;
    text-align: center;
  }

  & > p {
    font-size: 1.2rem;
  }
`;

const IntroductionContent: React.FC = () => (
  <ContentDiv>
    <p>Can’t decide whose turn it is to do the chores? Or pay for the next outing?</p>
    <p>Decide now with FAST and SIMPLE mini game with <BrandText />.</p>
    <StartNewGameButton />
  </ContentDiv>
);

export default IntroductionContent;
