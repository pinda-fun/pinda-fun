import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as PindaWavingSVG } from 'svg/pinda-waving-badge.svg';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist, CommAttributes } from 'components/room/comm/Comm';
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
  width: 300;

  font-family: var(--primary-font);
  color: var(--dark-purple);
  font-weight: normal;
  font-size: 1.8rem;
`;

const PindaWaving = styled(PindaWavingSVG)`
  height: 220;

  @media (max-width: ${mdMin}) {
    height: 185px;
  }
`;

const ErrorHeading = styled(Heading)`
  color: var(--red);
`;

const WaitingLobby: React.FC<FinishedComponentProps> = ({
  users, allMetas,
}) => {
  const [funMessage, setFunMessage] = useState('Waiting for more people to join...');

  useEffect(() => {
    setFunMessage(`${users.length} are now in the game!`);
  }, [users]);

  if (resultsExist(allMetas)) {
    return (
      <WaitingDiv>
        {Object.entries(allMetas).map(([clientId, { name, result }]) => (
          <p key={clientId}>{name}: {result}</p>
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

const ParticipantRoom: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => (
  <CommonRoom
    commHooks={commHooks}
    NoHostComponent={HostLeft}
    FinishedComponent={WaitingLobby}
  />
);

export default ParticipantRoom;
