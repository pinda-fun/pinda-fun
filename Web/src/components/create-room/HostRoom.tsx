import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import BigButton from 'components/common/BigButton';
import CommContext from 'components/room/comm/CommContext';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist, CommAttributes } from 'components/room/comm/Comm';
import Game from 'components/room/Games';
import { ChevronDown } from 'react-feather';
import NumPlayers from './NumPlayers';
import SocialShare from './SocialShare';
import QrCode from './QrCode';
import { mdMin } from '../../utils/media';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';
import RoomMembers from './RoomMembers';

const CreateRoomContainer = styled.div`
  background: var(--pale-yellow);
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RoomDetailsSection = styled.section`
  min-height: ${window.innerHeight}px;
  position: relative;

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

const MembersSection = styled.section`
  margin: 1rem 0;
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

const ScrollDownPrompt = styled.div`
  position: absolute;
  bottom: 0px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > svg {
    width: 42px;
  }
`;

const PindaHappy = styled(PindaHappySVG)`
  position: fixed;
  height: 270px;
  bottom: -30px;
  right: -80px;

  @media (max-width: ${mdMin}) {
    display: none;
  }
`;

const HostRoomLobby: React.FC<FinishedComponentProps> = ({
  room, error, users, allMetas, game,
}) => {
  const comm = useContext(CommContext);

  const onStartButtonClick = () => {
    const allGames = Object.values(Game).filter((value) => value !== game.toString()) as Game[];
    const nextGame = allGames[Math.floor(Math.random() * allGames.length)];
    comm.changeGame(nextGame, () => comm.prepare());
  };

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
      <RoomDetailsSection>
        {resultsExist(allMetas) && (
          <>
            <h1>Last Game:</h1>
            {Object.entries(allMetas).map(([clientId, { name, result }]) => (
              <p key={clientId}>{name}: {result}</p>
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
          onClick={onStartButtonClick}
        >
          START!
        </StartButton>
        <Link to={{ pathname: '/' }}>Cancel</Link>
        <ScrollDownPrompt>
          View Players
          <ChevronDown />
        </ScrollDownPrompt>
      </RoomDetailsSection>
      <MembersSection>
        <RoomMembers users={users} />
      </MembersSection>
      <PindaHappy />
    </CreateRoomContainer>
  );
};

const HostRoomPage: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => (
  <CommonRoom
    commHooks={commHooks}
    FinishedComponent={HostRoomLobby}
  />
);
export default HostRoomPage;
