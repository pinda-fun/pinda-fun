import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCommHooks from 'components/room/comm/useCommHooks';
import CommContext from 'components/room/comm/CommContext';
import JoinRoomPage from './JoinRoomPage';
import ParticipantRoom from './ParticipantRoom';

const JoinRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialId] = useState(id);
  const comm = useContext(CommContext);
  const commHooks = useCommHooks(comm);

  useEffect(() => {
    if (id) navigate('/join', { replace: true });
  }, [navigate, id]);

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
