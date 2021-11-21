import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useCommHooks from 'components/room/comm/useCommHooks';
import CommContext from 'components/room/comm/CommContext';
import JoinRoomPage from './JoinRoomPage';
import ParticipantRoom from './ParticipantRoom';

interface JoinRoomMatchParams {
  id?: string
}

const JoinRoom = () => {
  const { id } = useParams<JoinRoomMatchParams>();
  const history = useHistory();
  const [initialId] = useState(id);
  const comm = useContext(CommContext);
  const commHooks = useCommHooks(comm);

  useEffect(() => {
    if (id) history.replace('/join');
  }, [history, id]);

  return (
    <>
      {commHooks.room === null
        && <JoinRoomPage commHooks={commHooks} roomId={initialId} />}
      {commHooks.room !== null
        && <ParticipantRoom commHooks={commHooks} />}
    </>
  );
};

export default JoinRoom;
