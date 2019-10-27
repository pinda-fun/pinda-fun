import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, Redirect } from 'react-router-dom';
import { ReactComponent as PindaWavingSVG } from 'svg/pinda-waving-badge.svg';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
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

const Waiting: React.FC = () => {
  const comm = useContext(CommContext);
  const [funMessage, setFunMessage] = useState('Waiting for more people to join...');
  const [selectedGame, selectGame] = useState('');
  const [hostPresent, setHostPresent] = useState(true);

  const {
    room, error, hostMeta, users,
  } = useCommHooks(comm);

  // generic leave room cleanup hook.
  useEffect(() => () => comm.leaveRoom(), [comm]);

  useEffect(() => {
    if (hostMeta === null) {
      setHostPresent(false);
      return;
    }
    setHostPresent(true);
    setFunMessage(`${users.length} are now in the game!`);
    const { game } = hostMeta;
    selectGame(game);
  }, [hostMeta, users]);

  if (error) {
    return <Redirect to="/join" />;
  }

  if (room === null) {
    return <Redirect to="/join" />;
  }

  return (
    <WaitingDiv>
      {hostPresent
        && (
          <>
            <Heading>
              {funMessage}
            </Heading>
            <Heading>
              We are going to play {selectedGame}
            </Heading>
          </>
        )}
      {!hostPresent
        && (
          <>
            <ErrorHeading>
              Oh no! <br />
              Looks like host has left!
            </ErrorHeading>
            <Link to="/join">
              Go Back
            </Link>
          </>
        )}
      <PindaWaving />
    </WaitingDiv>
  );
};

export default Waiting;
