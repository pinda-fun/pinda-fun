import React, {
  useState, useContext, useEffect, lazy,
} from 'react';
import CommContext from 'components/room/comm/CommContext';
import Loading from 'components/common/Loading';
import BigButton from 'components/common/BigButton';
import GameState from './comm/GameState';
import Game from './Games';
import { CommAttributes, ResultMap } from './comm/Comm';

const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const MentalSums = lazy(() => import('components/games/MentalSums'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));

export interface FinishedComponentProps extends CommAttributes {
  game: Game;
  resultMeta: ResultMap | null;
}

interface CommonRoomProps {
  commHooks: CommAttributes;
  FinishedComponent: React.FC<FinishedComponentProps>;
  NoHostComponent?: React.FC;
}

const GameComponent: React.FC<{ game: Game }> = ({ game }) => (
  <>
    {game === Game.SHAKE
      && <BalloonShake />}
    {game === Game.SUMS
      && <MentalSums />}
    {game === Game.SEQUENCE
      && <PandaSequence />}
  </>
);

const CommonRoom: React.FC<CommonRoomProps> = ({
  commHooks,
  FinishedComponent,
  NoHostComponent = () => <p>No Host :(</p>,
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
    if (hostMeta === null) {
      // If host left, leave the room
      if (myMeta !== null && !myMeta.isHost && room !== null) comm.leaveRoom();
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

  if (hostMeta === null) {
    return <NoHostComponent />;
  }

  return (
    <>
      {hostMeta.state === GameState.FINISHED
        && (
          <FinishedComponent
            {...{ ...commHooks, game, resultMeta }}
          />
        )}
      {hostMeta.state === GameState.ONGOING
        && <GameComponent game={game} />}
      {hostMeta.state === GameState.PREPARE
        && (
          <Loading>
            {isReady && <p>You are ready!</p>}
            {!isReady && <BigButton onClick={onReadyClick}>I am ready!</BigButton>}
          </Loading>
        )}
    </>
  );
};

export default CommonRoom;
