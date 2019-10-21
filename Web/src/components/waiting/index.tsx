import React from 'react';
import styled from 'styled-components';
import { mdMin } from '../../utils/media';
import { ReactComponent as PindaWavingSVG } from 'svg/pinda-waving-badge.svg';

const WaitingDiv = styled.div`
  background-color: var(--pale-purple);
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Heading = styled.h1`
  width: 300px;

  font-family: var(--primary-font);
  color: var(--dark-purple);
  font-weight: normal;
  font-size: 1.8rem;
`;

const PindaWaving = styled(PindaWavingSVG)`
  height: 220px;

  @media (max-width: ${mdMin}) {
    height: 185px;
  }
`;

const Waiting: React.FC = () => (
  <WaitingDiv>
    <Heading>Waiting for game to start...</Heading>
    <PindaWaving />
  </WaitingDiv>
);

export default Waiting;
