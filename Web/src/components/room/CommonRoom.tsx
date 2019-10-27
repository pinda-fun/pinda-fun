import React, {
  useState, useContext, useEffect, lazy,
} from 'react';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import Loading from 'components/common/Loading';
import BigButton from 'components/common/BigButton';
import GameState from './comm/GameState';
import Game from './Games';
import { CommError } from './comm/Errors';
import { ResultMap } from './comm/Comm';

const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const MentalSums = lazy(() => import('components/games/MentalSums'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));

export interface FinishedComponentProps {
  results: ResultMap | null;
  room: string | null;
  error: CommError | null;
  users: string[];
  game: Game;
}

interface CommonRoomProps {
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
  FinishedComponent,
  NoHostComponent = () => <p>No Host :(</p>,
}) => {
  const comm = useContext(CommContext);
  const [game, setGame] = useState(Game.SHAKE);
  const [isReady, setIsReady] = useState(false);

  // general hook to disconnect host from room when he leaves.
  useEffect(() => () => comm.leaveRoom(), [comm]);

  const {
    hostMeta, room, error, users, results,
  } = useCommHooks(comm);

  const onReadyClick = () => {
    comm.readyUp();
    setIsReady(true);
  };

  useEffect(() => {
    if (hostMeta === null) return;
    setGame(hostMeta.game);
    if (hostMeta.state === GameState.FINISHED) {
      setIsReady(false);
    }
  }, [hostMeta]);

  if (hostMeta === null) {
    return <NoHostComponent />;
  }

  return (
    <>
      {hostMeta.state === GameState.FINISHED
        && (
          <FinishedComponent
            {... {
              results, room, users, error, game,
            }}
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
