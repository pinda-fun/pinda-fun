import React, { useContext } from 'react';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import HostRoom from './HostRoom';
import CreateRoomPage from './CreateRoomPage';

const CreateRoom = () => {
  const comm = useContext(CommContext);
  const commHooks = useCommHooks(comm);
  return (
    <>
      {commHooks.room === null
        && <CreateRoomPage commHooks={commHooks} />}
      {commHooks.room !== null
        && <HostRoom {...{ commHooks }} />}
    </>
  );
};

export default CreateRoom;
