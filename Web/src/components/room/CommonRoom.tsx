import React, { useState, useContext } from 'react';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import { RoomState, Games } from './states';

export interface PrepareComponentProps {
  changeState?: React.Dispatch<React.SetStateAction<RoomState>>;
}

export interface ResultsComponentProps {
  results: any[];
}

interface CommonRoomProps {
  PrepareComponent: React.FC;
  ResultsComponent: React.FC<ResultsComponentProps>;
}

const CommonRoom: React.FC<CommonRoomProps> = ({
  PrepareComponent, ResultsComponent
}) => {
  const comm = useContext(CommContext);
  const [roomState, setRoomState] = useState(RoomState.PREPARING);
  const [game] = useState(Games.SHAKE);

  const {
    hostMeta
  } = useCommHooks(comm);

  return (
    <>
      {roomState === RoomState.PREPARING
        && <PrepareComponent />}
      {roomState === RoomState.IN_GAME
        && <p>GAME HERE </p>}
      {roomState === RoomState.FINISHED
        && <ResultsComponent results={[]} />}
    </>
  );
};

export default CommonRoom;
