import React, { useState, useContext, useEffect } from 'react';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import Loading from 'components/common/Loading';
import GameState from './comm/GameState';
import Game from './Games';
import { CommError } from './comm/Errors';

export interface FinishedComponentProps {
  results?: any[];
  room: string | null;
  error: CommError | null;
  users: string[];
}

interface CommonRoomProps {
  FinishedComponent: React.FC<FinishedComponentProps>;
}

const CommonRoom: React.FC<CommonRoomProps> = ({
  FinishedComponent
}) => {
  const comm = useContext(CommContext);
  const [game] = useState(Game.SHAKE);

  const {
    hostMeta, room, error, users
  } = useCommHooks(comm);

  useEffect(() => {
    if (hostMeta === null) {
      console.log('null for some reason');
      return;
    }
    let roomState = hostMeta.state;
    console.log(roomState);
  }, [hostMeta]);

  if (hostMeta === null) {
    return <p>Error</p>;
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
          />
        )}
      {hostMeta.state === GameState.PREPARE
        && <Loading />}
      {hostMeta.state === GameState.ONGOING
        && <p>GAME HERE </p>}
    </>
  );
};

export default CommonRoom;
