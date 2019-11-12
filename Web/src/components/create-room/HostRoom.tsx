import React, { useState, useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import BigButton from 'components/common/BigButton';
import ScrollDownButton from 'components/common/ScrollDownButton';
import CommContext from 'components/room/comm/CommContext';
import CommonRoom, { FinishedComponentProps } from 'components/room/CommonRoom';
import { resultsExist, CommAttributes } from 'components/room/comm/Comm';
import useWindowSize from 'utils/useWindowSize';
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

interface RoomDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  windowInnerHeight: number;
}

/**
 * Wrapper to remove custom DOM attributes before rendering HTML DOM
 * See: https://www.styled-components.com/docs/faqs#why-am-i-getting-html-attribute-warnings
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RoomDetails = ({ windowInnerHeight, ...props }: RoomDetailsProps) => (
  <div {...props} />
);

const RoomDetailsContainer = styled(RoomDetails)`
  min-height: ${({ windowInnerHeight }: RoomDetailsProps) => windowInnerHeight}px;
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

const HostRoomLobby: React.FC<FinishedComponentProps> = ({
  room, error, users, allMetas, resultMeta, game,
}) => {
  const [displayResults, setDisplayResults] = useState(true);
  const [isScrollPromptSticky, setIsScrollPromptSticky] = useState(false);
  const [, windowHeight] = useWindowSize();
  const comm = useContext(CommContext);
  const membersListRef = useRef<HTMLDivElement>(null);

  const onStartButtonClick = () => {
    const nextGame = gameSequenceGenerator.getNext();
    comm.refreshSeed(Date.now().toLocaleString());
    comm.changeGame(nextGame, () => comm.prepare());
  };

  const onExitResultsButtonClick = () => {
    setDisplayResults(false);
  };

  const handleRefChange = (element: HTMLElement | null) => {
    const spaceAroundContent = 100;
    if (element != null) {
      setIsScrollPromptSticky(element.clientHeight > (windowHeight - spaceAroundContent));
    }
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
      {resultsExist(allMetas) && displayResults && (
        <ResultsLeaderboard
          allMetas={resultMeta}
          game={game}
          exitCallback={onExitResultsButtonClick}
        />
      )}
      {!(resultsExist(allMetas) && displayResults)
        && (
        <CreateRoomContainer>
          <RoomDetailsContainer windowInnerHeight={windowHeight}>
            <RoomDetailsSection ref={handleRefChange}>
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
              <Link
                to={resultsExist(allMetas) ? {} : { pathname: '/' }}
                onClick={resultsExist(allMetas) ? () => setDisplayResults(true) : undefined}
              >
                Cancel
              </Link>
            </RoomDetailsSection>
            <ScrollDownButton
              promptText="View Players"
              scrollToRef={membersListRef}
              backgroundColor="var(--pale-yellow)"
              sticky={isScrollPromptSticky}
            />
          </RoomDetailsContainer>
          <MembersSection ref={membersListRef}>
            <RoomMembers users={users} />
          </MembersSection>
          <PindaHappy />
        </CreateRoomContainer>
        )}
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
