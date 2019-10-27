import React, { useState, useContext, useEffect, lazy } from 'react';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import Loading from 'components/common/Loading';
import GameState from './comm/GameState';
import Game from './Games';
import { CommError } from './comm/Errors';
import { HostMeta } from './database/Meta';

const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const MentalSums = lazy(() => import('components/games/MentalSums'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));

export interface FinishedComponentProps {
  results?: any[];
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

  // general hook to disconnect host from room when he leaves.
  useEffect(() => () => comm.leaveRoom(), [comm]);

  const {
    hostMeta, room, error, users
  } = useCommHooks(comm);

  useEffect(() => {
    if (hostMeta === null) return;
    setGame(hostMeta.game);
  }, [hostMeta]);

  if (hostMeta === null) {
    return <NoHostComponent />;
  }

  return (
    <>
      {hostMeta.state === GameState.FINISHED
        && (
          <FinishedComponent
            results={[]}
            room={room}
            users={users}
            error={error}
            game={game}
          />
        )}
      {hostMeta.state === GameState.ONGOING
        && <GameComponent game={game} />}
      {hostMeta.state === GameState.PREPARE
        && <Loading />}
    </>
  );
};

export default CommonRoom;
