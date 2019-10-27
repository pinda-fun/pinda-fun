import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BigButton from 'components/common/BigButton';
import NumPlayers from './NumPlayers';
import SocialShare from './SocialShare';
import QrCode from './QrCode';
import { mdMin } from '../../utils/media';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';
import Meta from 'components/room/database/Meta';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import { metaIsHost } from 'components/room/database/Meta';
import Database from 'components/room/database/Database';

const CreateRoomContainer = styled.div`
  background: var(--pale-yellow);
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > * {
    margin: 0.5rem 0;
  }

  h2 {
    font-family: var(--primary-font);
    margin: 0.5rem 0;
    font-weight: normal;
    font-size: 1.3rem;
  }
`;

const TwoColumnDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  & > * {
    margin: 0 1rem;
  }

  @media (max-width: ${mdMin}) {
    flex-direction: column;
    align-items: center;
  }
`;

const GamePinSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: baseline;

  @media (max-width: ${mdMin}) {
    flex-direction: row;
  }

  h1 {
    margin: 2rem 0 0 0;
    color: var(--red);
    text-shadow: 6px 6px 0px var(--pink);
    font-size: 9rem;
    letter-spacing: 0.8rem;

    @media (max-width: ${mdMin}) {
      text-shadow: 3px 3px 0px var(--pink);
      font-size: 4rem;
      margin-left: 0.5rem;
    }
  }
`;

const ShareSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const ShareContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  & > * {
    margin: 0.5rem 0;
  }

  @media (max-width: ${mdMin}) {
    flex-direction: column-reverse;
  }
`;

const StartButton = styled(BigButton)`
  padding-left: 3rem;
  padding-right: 3rem;
`;

const PindaHappy = styled(PindaHappySVG)`
  position: absolute;
  height: 270px;
  bottom: -30px;
  right: -80px;

  @media (max-width: ${mdMin}) {
    display: none;
  }
`;

interface MetaMap {
  [clientId: string]: Meta;
}

const userIsHost = (database: Database | null): boolean => {
  if (!database) return false;
  const meta = database.getMyMeta();
  return !!(meta && metaIsHost(meta));
};

const HostRoomPage: React.FC = () => {
  const comm = useContext(CommContext);
  const {
    room, error, database,
  } = useCommHooks(comm);
  const [players, setPlayers] = useState<MetaMap>({});

  useEffect(() => {
    if (!database || !database.getMetas()) return;
    setPlayers(database.getMetas());
  }, [database]);

  const sharableLink = `${window.location.origin}/join/${room}`;

  // TODO: stylise error
  if (error !== null) {
    return <p>Error: {error}</p>;
  }

  /*
  if (room === null || !userIsHost(database)) {
    // This means that the host is not connected to any room,
    // Or I am not the host of this room.
    console.log(room, database);
    return <Redirect to="/join" />;
  }
  */

  return (
    <CreateRoomContainer>
      <TwoColumnDiv>
        <div>
          <GamePinSection>
            <h2>Game PIN:</h2>
            <h1>{room}</h1>
          </GamePinSection>
          <NumPlayers numPlayers={Object.entries(players).length} hideOnMedium />
        </div>
        <ShareSection>
          <h2>Share via</h2>
          <ShareContent>
            <QrCode sharableLink={sharableLink} />
            <SocialShare sharableLink={sharableLink} />
          </ShareContent>
          <NumPlayers numPlayers={Object.entries(players).length} hideOnLarge />
        </ShareSection>
      </TwoColumnDiv>
      <Link to={{ pathname: '/room' }}>
        <StartButton>START!</StartButton>
      </Link>
      <Link to={{ pathname: '/' }}>Cancel</Link>
      {Object.entries(players).map(([name, meta]) => (
        <p>{name}: {meta.name}</p>
      ))}
      <PindaHappy />
    </CreateRoomContainer>
  );
};

export default HostRoomPage;
