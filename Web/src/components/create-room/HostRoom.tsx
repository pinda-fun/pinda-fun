import React, { useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import BigButton from 'components/common/BigButton';
import ScrollDownButton from 'components/common/ScrollDownButton';
import CommContext from 'components/room/comm/CommContext';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist, CommAttributes } from 'components/room/comm/Comm';
import NumPlayers from './NumPlayers';
import SocialShare from './SocialShare';
import QrCode from './QrCode';
import { mdMin } from '../../utils/media';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';
import ResultsLeaderboard from '../results-leaderboard';
import RoomMembers from './RoomMembers';
import GameSequenceGenerator from './GameSequenceGenerator';

const CreateRoomContainer = styled.div`
  background: var(--pale-yellow);
  position: relative;
  overflow-x: hidden;

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
    text-shadow: 6px 6px 0 var(--pink);
    font-size: 9rem;
    letter-spacing: 0.8rem;

    @media (max-width: ${mdMin}) {
      text-shadow: 3px 3px 0 var(--pink);
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

const PindaHappy = styled(PindaHappySVG)`
  position: fixed;
  height: 270px;
  bottom: -30px;
  right: -80px;

  @media (max-width: ${mdMin}) {
    display: none;
  }
`;

const gameSequenceGenerator = new GameSequenceGenerator();

const HostRoomLobby: React.FC<FinishedComponentProps> = ({
  room, error, users, allMetas, resultMeta,
}) => {
  const comm = useContext(CommContext);
  const membersListRef = useRef<HTMLDivElement>(null);

  const onStartButtonClick = () => {
    const nextGame = gameSequenceGenerator.getNext();
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
    <>
      {resultsExist(allMetas) && (
        <ResultsLeaderboard
          allMetas={resultMeta}
          gameText="shakes/sequences/sums!"
        />
      )}
      <CreateRoomContainer>
        <RoomDetailsSection>
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
          <ScrollDownButton
            promptText="View Players"
            scrollToRef={membersListRef}
            backgroundColor="var(--pale-yellow)"
            sticky
          />
        </RoomDetailsSection>
        <MembersSection>
          <RoomMembers users={users} />
        </MembersSection>
        <PindaHappy />
      </CreateRoomContainer>
    </>
  );
};

const HostRoomPage: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => (
  <CommonRoom
    commHooks={commHooks}
    FinishedComponent={HostRoomLobby}
  />
);
export default HostRoomPage;
