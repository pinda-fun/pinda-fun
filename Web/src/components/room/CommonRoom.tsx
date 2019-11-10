import React, {
  useState, useContext, useEffect, lazy,
} from 'react';
import ReactGA from 'react-ga';
import CommContext from 'components/room/comm/CommContext';
import BigButton from 'components/common/BigButton';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import GameState from './comm/GameState';
import Game from './Games';
import { CommAttributes, ResultMap } from './comm/Comm';

const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const MentalSums = lazy(() => import('components/games/MentalSums'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));

const BalloonShakeInstructions = lazy(() => import('components/games/BalloonShake/BalloonShakeInstructions'));
const MentalSumsInstructions = lazy(() => import('components/games/MentalSums/MentalSumsInstructions'));
const PandaSequenceInstructions = lazy(() => import('components/games/PandaSequence/PandaSequenceInstructions'));

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

const GameComponent: React.FC<{ game: Game, seed: string }> = ({ game, seed }) => (
  <>
    {game === Game.SHAKE
      && <BalloonShake />}
    {game === Game.SUMS
      && <MentalSums seed={seed} />}
    {game === Game.SEQUENCE
      && <PandaSequence seed={seed} />}
  </>
);

const GameInstructionComponent: React.FC<{ game: Game, actions: React.ReactNode }> = ({
  game, actions,
}) => (
  <>
    {game === Game.SHAKE
        && <BalloonShakeInstructions actions={actions} />}
    {game === Game.SUMS
        && <MentalSumsInstructions actions={actions} />}
    {game === Game.SEQUENCE
        && <PandaSequenceInstructions actions={actions} />}
  </>
);

const InverseButton = styled(BigButton)`
  background: white;
  color: var(--purple);
`;

const WhiteLink = styled(Link)`
  color: white;
`;

const defaultPreparedComponent: React.FC<PreparedComponentProps> = ({
  isReady, onReadyClick, game,
}) => {
  const actions = (
    <>
      {isReady && <p>Waiting for other players</p>}
      {!isReady && <InverseButton onClick={onReadyClick}>I am ready!</InverseButton>}
      <WhiteLink to={{ pathname: '/' }}>Quit</WhiteLink>
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
