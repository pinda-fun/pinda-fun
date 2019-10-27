import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, Redirect } from 'react-router-dom';
import { ReactComponent as PindaWavingSVG } from 'svg/pinda-waving-badge.svg';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist } from 'components/room/comm/Comm';
import { mdMin } from '../../utils/media';

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

const ErrorHeading = styled(Heading)`
  color: var(--red);
`;

const WaitingLobby: React.FC<FinishedComponentProps> = ({
  room, users, error, game, results,
}) => {
  const [funMessage, setFunMessage] = useState('Waiting for more people to join...');

  useEffect(() => {
    setFunMessage(`${users.length} are now in the game!`);
  }, [users]);

  if (error) {
    return <Redirect to="/join" />;
  }

  if (room === null) {
    return <Redirect to="/join" />;
  }

  if (resultsExist(results)) {
    return (
      <WaitingDiv>
        {Object.entries(results).map(([name, score]) => (
          <p>{name}: {score}</p>
        ))}
        <Heading>
          Waiting for next game...
        </Heading>
      </WaitingDiv>
    );
  }
  return (
    <WaitingDiv>
      <Heading>
        {funMessage}
      </Heading>
      <Heading>
        We are going to play {game}
      </Heading>
      <PindaWaving />
    </WaitingDiv>
  );
};

const HostLeft: React.FC = () => (
  <WaitingDiv>
    <ErrorHeading>
      Oh no! <br />
      Looks like host has left!
    </ErrorHeading>
    <Link to="/join">
      Go Back
    </Link>
    <PindaWaving />
  </WaitingDiv>
);

const Waiting: React.FC = () => (
  <CommonRoom
    NoHostComponent={HostLeft}
    FinishedComponent={WaitingLobby}
  />
);

export default Waiting;
