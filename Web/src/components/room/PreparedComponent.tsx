import React, { lazy, useState } from 'react';
import {
  Users, UserX, UserCheck, Icon,
} from 'react-feather';
import BigButton from 'components/common/BigButton';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Modal from 'components/common/Modal';
import { ListItemContainer, ListItem } from 'components/List';
import Game from './Games';
import { ResultMap } from './comm/Comm';

const BalloonShakeInstructions = lazy(() => import('components/games/BalloonShake/BalloonShakeInstructions'));
const MentalSumsInstructions = lazy(() => import('components/games/MentalSums/MentalSumsInstructions'));
const PandaSequenceInstructions = lazy(() => import('components/games/PandaSequence/PandaSequenceInstructions'));

export interface PreparedComponentProps {
  isReady: boolean;
  onReadyClick: () => void;
  game: Game;
  allMetas: ResultMap | null;
}

interface PlayerInfoModalProps {
  isVisible: boolean;
  allMetas: ResultMap;
  closeAction: () => void;
}

const InverseButton = styled(BigButton)`
  background: white;
  color: var(--purple);
`;

const WhiteLink = styled(Link)`
  color: white;
`;

const UsersIcon = styled(Users as React.FC<React.ComponentProps<Icon>>)`
  stroke-width: 3;
`;

const UserCheckIcon = styled(UserCheck as React.FC<React.ComponentProps<Icon>>)`
  stroke-width: 3;
  color: var(--green);
`;

const UserXIcon = styled(UserX as React.FC<React.ComponentProps<Icon>>)`
  stroke-width: 3;
  color: var(--red);
`;

const NameSpan = styled.span`
  width: calc(100% - 2em);
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PlayerListContainer = styled(ListItemContainer)`
  width: 100%;
  max-height: 50vh;
  overflow-y: auto;
`;

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

const NumPlayersContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  & > * {
    margin: 0 0.25rem;
  }

  && > svg {
    height: 2em;
  }
`;

const PlayerInfoModal: React.FC<PlayerInfoModalProps> = ({
  isVisible, allMetas, closeAction,
}) => (
  <Modal
    isVisible={isVisible}
    title="Player Statuses"
    confirmationButtonText="Ok"
    onConfirm={closeAction}
    wider
  >
    <PlayerListContainer>
      {Object.values(allMetas).map(({ name, result }) => (
        <ListItem>
          <NameSpan>
            {name}
          </NameSpan>
          {result === null ? <UserCheckIcon /> : <UserXIcon />}
        </ListItem>
      ))}
    </PlayerListContainer>
  </Modal>
);

const PreparedComponent: React.FC<PreparedComponentProps> = ({
  isReady, onReadyClick, game, allMetas = {},
}) => {
  const readyCount = allMetas !== null
    ? Object.values(allMetas).filter((x) => x.result === null).length
    : 0;
  const totalCount = allMetas !== null ? Object.values(allMetas).length : 0;
  const [modalOpen, setModalOpen] = useState(false);

  const actions = (
    <>
      <NumPlayersContainer onClick={() => setModalOpen(true)}>
        <UsersIcon />
        <span>{readyCount}/{totalCount} Players Ready</span>
      </NumPlayersContainer>
      {!isReady && <InverseButton onClick={onReadyClick}>I am ready!</InverseButton>}
      <WhiteLink to={{ pathname: '/' }}>Quit</WhiteLink>
    </>
  );

  return (
    <>
      {allMetas !== null
        && (
          <PlayerInfoModal
            isVisible={modalOpen}
            allMetas={allMetas}
            closeAction={() => setModalOpen(false)}
          />
        )}
      <GameInstructionComponent game={game} actions={actions} />
    </>
  );
};

export default PreparedComponent;
