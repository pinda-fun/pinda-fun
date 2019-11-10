import React, {
  useContext, useRef, RefObject, useEffect,
} from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import BigButton from 'components/common/BigButton';
import ScrollDownButton from 'components/common/ScrollDownButton';
import CommContext from 'components/room/comm/CommContext';
import CommonRoom, {
  FinishedComponentProps, PreparedComponentProps,
} from 'components/room/CommonRoom';
import { resultsExist, CommAttributes } from 'components/room/comm/Comm';
import { GameInstructionComponent } from 'components/room/GameComponents';
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
  overflow: visible;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RoomDetailsContainer = styled.div`
  min-height: ${window.innerHeight}px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RoomDetailsSection = styled.section`
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

const isStickyScrollPrompt = (contentRef: RefObject<HTMLDivElement>) => {
  const spaceAroundContent = 50;
  if (contentRef.current != null) {
    return contentRef.current.clientHeight > (window.innerHeight - spaceAroundContent);
  }
  return false;
};

const HostRoomLobby: React.FC<FinishedComponentProps> = ({
  room, error, users, allMetas, resultMeta, game,
}) => {
  const comm = useContext(CommContext);
  const membersListRef = useRef<HTMLDivElement>(null);
  const roomDetailsRef = useRef<HTMLDivElement>(null);

  const onStartButtonClick = () => {
    const nextGame = gameSequenceGenerator.getNext();
    comm.refreshSeed(Date.now().toLocaleString());
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
          game={game}
        />
      )}
      <CreateRoomContainer>
        <RoomDetailsContainer>
          <RoomDetailsSection ref={roomDetailsRef}>
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
          </RoomDetailsSection>
          <ScrollDownButton
            promptText="View Players"
            scrollToRef={membersListRef}
            backgroundColor="var(--pale-yellow)"
            sticky={isStickyScrollPrompt(roomDetailsRef)}
          />
        </RoomDetailsContainer>
        <MembersSection ref={membersListRef}>
          <RoomMembers users={users} />
        </MembersSection>
        <PindaHappy />
      </CreateRoomContainer>
    </>
  );
};

const InverseButton = styled(BigButton)`
  background: white;
  color: var(--purple);
`;

const HostRoomPage: React.FC<{ commHooks: CommAttributes }> = ({ commHooks }) => {
  const comm = useContext(CommContext);
  const { allMetas } = commHooks;

  const readyCount = allMetas !== null
    ? Object.values(allMetas).filter((x) => x.result === null).length
    : 0;
  const totalCount = allMetas !== null ? Object.values(allMetas).length : 0;

  useEffect(() => comm.readyUp(), [comm]);

  const hostPreparedComponent: React.FC<PreparedComponentProps> = ({
    isReady, game,
  }) => {
    const actions = isReady === null ? null : (
      <>
        <p>{readyCount}/{totalCount} Players Ready</p>
        <InverseButton onClick={() => comm.startGame()}>
          {readyCount < totalCount ? 'Start anyway' : 'Start'}
        </InverseButton>
      </>
    );
    return <GameInstructionComponent game={game} actions={actions} />;
  };

  return (
    <CommonRoom
      commHooks={commHooks}
      FinishedComponent={HostRoomLobby}
      PreparedComponent={hostPreparedComponent}
    />
  );
};
export default HostRoomPage;
