import React, { useEffect, useState } from 'react';

import useErrorableChannel from './hooks/useErrorableChannel';
import BalloonShake from '../../games/BalloonShake';
import PendingPage from './pending/index';
import RoomState from './RoomState';
import getClientId from '../../utils/getClientId';

const RoomPage: React.FC = () => {
  const { channel, error } = useErrorableChannel('room:lobby');
  const [roomState, setRoomState] = useState<RoomState>();
  const [rank, setRank] = useState<number>();

  useEffect(() => {
    if (channel == null) return;
    setRoomState(RoomState.PENDING);
  }, [channel]);

  if (error != null) {
    const [cause, _] = error;
    return <p>Error: {cause}</p>;
  }
  if (channel == null) {
    return <p>Establishing connection...</p>;
  }

  const pushMessage = (type:string, payload:object) => {
    if (!channel) return;
    channel.push(type, payload);
  };

  const startGame = ():void => {
    if (roomState !== RoomState.PENDING) throw new Error();
    setRoomState(RoomState.IN_PROGRESS);
    pushMessage('start', {});
  };

  const submitResult = (res: number) => {
    pushMessage('result', { score: res });
    channel.on('result', ({ result }) => {
      result.sort((a:string[], b:string[]) => parseInt(a[0]) - parseInt(b[0]));
      setRank(result.findIndex((x:string) => x[1] === getClientId()) + 1);
    });
    setRoomState(RoomState.COMPLETED);
  };

  if (roomState === RoomState.PENDING) {
    return (
      <PendingPage startGame={startGame} />
    );
  } if (roomState === RoomState.IN_PROGRESS) {
    return (
      <div>
        <BalloonShake />
      </div>
    );
  } if (roomState === RoomState.COMPLETED) {
    return (
      <div>
        <h2>Your rank: { rank }</h2>
      </div>
    );
  }
  return (
    <h2>Room State: { roomState }</h2>
  );
};

export default RoomPage;
