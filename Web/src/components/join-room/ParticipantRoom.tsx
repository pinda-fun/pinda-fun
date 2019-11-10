import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as PindaWavingSVG } from 'svg/pinda-waving-badge.svg';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist, CommAttributes } from 'components/room/comm/Comm';
import { Link } from 'react-router-dom';
import { mdMin } from '../../utils/media';
import ResultsLeaderboard from '../results-leaderboard';

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

const WaitingLobby: React.FC<FinishedComponentProps> = ({
  users, allMetas, resultMeta, game,
}) => {
  const [funMessage, setFunMessage] = useState('Waiting for more people to join...');

  useEffect(() => {
    setFunMessage(`${users.length} are now in the game!`);
  }, [users]);

  if (resultsExist(allMetas)) {
    return (
      <ResultsLeaderboard
        allMetas={resultMeta}
        game={game}
      />
    );
  }
  return (
    <WaitingDiv>
      <Heading>
        {funMessage}
      </Heading>
      <PindaWaving />
      <Link to={{ pathname: '/' }}>Exit</Link>
    </WaitingDiv>
  );
};

const ParticipantRoom: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => (
  <CommonRoom
    commHooks={commHooks}
    FinishedComponent={WaitingLobby}
  />
);

export default ParticipantRoom;
