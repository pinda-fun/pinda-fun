import React, {
  useState, useContext, useEffect,
} from 'react';
import ReactGA from 'react-ga';
import ReactLoading from 'react-loading';
import CommContext from 'components/room/comm/CommContext';
import BigButton from 'components/common/BigButton';
import styled from 'styled-components/macro';
import GameState from './comm/GameState';
import Game from './Games';
import { CommAttributes, ResultMap } from './comm/Comm';
import { GameComponent, GameInstructionComponent } from './GameComponents';

export interface FinishedComponentProps extends CommAttributes {
  game: Game;
  resultMeta: ResultMap | null;
}

export interface PreparedComponentProps {
  isReady: boolean;
  onReadyClick: () => void;
  game: Game;
}

interface CommonRoomProps {
  commHooks: CommAttributes;
  FinishedComponent: React.FC<FinishedComponentProps>;
  PreparedComponent?: React.FC<PreparedComponentProps>;
}

const InverseButton = styled(BigButton)`
  background: white;
  color: var(--purple);
`;

const CustomLoading = styled(ReactLoading)`
  svg {
    height: 4em !important; /* Caryn told me to do this */
  }
`;

const defaultPreparedComponent: React.FC<PreparedComponentProps> = ({
  isReady, onReadyClick, game,
}) => {
  const actions = (
    <>
      {isReady && (
        <>
          <CustomLoading
            type="bubbles"
            color="white"
          />
          <p>Waiting for game to start...</p>
        </>
      )}
      {!isReady && <InverseButton onClick={onReadyClick}>I am ready!</InverseButton>}
    </>
  );
  return <GameInstructionComponent game={game} actions={actions} />;
};

const CommonRoom: React.FC<CommonRoomProps> = ({
  commHooks,
  FinishedComponent,
  PreparedComponent = defaultPreparedComponent,
}) => {
  const comm = useContext(CommContext);
  const [game, setGame] = useState(Game.SHAKE);
  const [isReady, setIsReady] = useState(false);
  const [resultMeta, setResultMeta] = useState<ResultMap | null>(null);
  const [isResultSet, setIsResultSet] = useState(false);

  // general hook to disconnect host from room when he leaves.
  useEffect(() => () => {
    comm.leaveRoom();
  }, [comm]);

  const {
    hostMeta, myMeta, allMetas, room,
  } = commHooks;

  const onReadyClick = () => {
    comm.readyUp();
    setIsReady(true);
  };

  useEffect(() => {
    if (hostMeta != null && hostMeta.state === GameState.ONGOING) {
      ReactGA.event({ category: 'game', action: game });
    }
  }, [game, hostMeta]);

  useEffect(() => {
    if (hostMeta === null) {
      // If host left, leave the room
      if (myMeta !== null && !myMeta.isHost && room !== null) {
        comm.leaveRoom();
        comm.markHostLeft();
      }
      return;
    }
    setGame(hostMeta.game);
    if (hostMeta.state === GameState.FINISHED) {
      setIsReady(false);
    }
  }, [comm, hostMeta, myMeta, room]);

  useEffect(() => {
    if (hostMeta === null) {
      return;
    }

    if (hostMeta.state === GameState.FINISHED && !isResultSet) {
      setResultMeta(allMetas);
      setIsResultSet(true);
    } else if (hostMeta.state !== GameState.FINISHED) {
      setIsResultSet(false);
    }
  }, [isResultSet, hostMeta, allMetas]);

  if (hostMeta === null) return null;

  return (
    <>
      {hostMeta.state === GameState.FINISHED
        && (
          <FinishedComponent
            {...{ ...commHooks, game, resultMeta }}
          />
        )}
      {hostMeta.state === GameState.ONGOING
        && <GameComponent game={game} seed={hostMeta.seed} />}
      {hostMeta.state === GameState.PREPARE
        && (
          <PreparedComponent
            isReady={isReady}
            onReadyClick={onReadyClick}
            game={game}
          />
        )}
    </>
  );
};

export default CommonRoom;
