import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import BigButton from 'components/common/BigButton';
import CommContext from 'components/room/comm/CommContext';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist } from 'components/room/comm/Comm';
import NumPlayers from './NumPlayers';
import SocialShare from './SocialShare';
import QrCode from './QrCode';
import { mdMin } from '../../utils/media';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';

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

const HostRoomLobby: React.FC<FinishedComponentProps> = ({
  room, error, users, results,
}) => {
  const comm = useContext(CommContext);

  const sharableLink = `${window.location.origin}/join/${room}`;

  // TODO: stylise error
  if (error !== null) {
    return <p>Error: {error}</p>;
  }

  if (room === null) {
    // This means that the host is not connected to any room,
    // Or I am not the host of this room.
    return <Redirect to="/join" />;
  }

  return (
    <CreateRoomContainer>
      {resultsExist(results) && (
        <>
          <h1>Last Game:</h1>
          {Object.entries(results).map(([guy, score]) => (
            <p>{guy}: {score}</p>
          ))}
        </>
      )}
      <TwoColumnDiv>
        <div>
          <GamePinSection>
            <h2>Game PIN:</h2>
            <h1>{room}</h1>
          </GamePinSection>
          <NumPlayers numPlayers={users.length} hideOnMedium />
        </div>
        <ShareSection>
          <h2>Share via</h2>
          <ShareContent>
            <QrCode sharableLink={sharableLink} />
            <SocialShare sharableLink={sharableLink} />
          </ShareContent>
          <NumPlayers numPlayers={users.length} hideOnLarge />
        </ShareSection>
      </TwoColumnDiv>
      <StartButton
        onClick={() => comm.prepare()}
      >
        START!
      </StartButton>
      <Link to={{ pathname: '/' }}>Cancel</Link>
      <h3>Connected:</h3>
      {users.map((name) => (
        <p key={name}>{name}</p>
      ))}
      <PindaHappy />
    </CreateRoomContainer>
  );
};

const HostRoomPage: React.FC = () => (
  <CommonRoom
    FinishedComponent={HostRoomLobby}
  />
);
export default HostRoomPage;
