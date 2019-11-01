import React from 'react';
import styled from 'styled-components';
import { ChevronUp, Icon } from 'react-feather';
import getClientId from 'utils/getClientId';
import { smMin } from 'utils/media';
import { Container, Group } from './Containers';

interface LeaderboardProps {
  playerScores: PlayerScore[];
}

export interface PlayerScore {
  clientId: string,
  name: string,
  score: number,
}

const BigText = styled.span`
  font-size: 2rem;
  font-family: var(--secondary-font);
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  align-items: center;
  position: sticky;
  top: 0px;
  text-align: center;
  width: 100vw;
  padding: 12px;
  font-size: 1rem;
`;

const UpArrowIcon = styled(ChevronUp as React.FC<React.ComponentProps<Icon>>)`
  width: 42px;
  height: 42px;
`;

const ListItemContainer = styled.div`
  width: ${smMin};
  overflow-x: hidden;
  margin: 1rem 0;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;

  @media (max-width: ${smMin}) {
    width: 75vw;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  width: auto;
  font-size: 1.1rem;
  color: black;
  padding:18px 18px;
  border-top: 1px solid var(--light-grey);

  :first-child {
    border: none;
  }
`;

// separate component so we can have a more divergent styling in future
const SelectedListItem = styled.div`
  background: var(--pale-yellow);
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding:18px 18px;
  border-top: 1px solid var(--light-grey);
  color: var(--red);

  :first-child {
    border: none;
  }
`;

const Leaderboard: React.FC<LeaderboardProps> = ({ playerScores }) => {
  const listItems = playerScores.map(({ clientId, name, score }, index) => {
    if (clientId === getClientId()) {
      return (
        <SelectedListItem key={clientId}>
          <div>{index + 1}</div>
          <div>{name}</div>
          <div>{score}</div>
        </SelectedListItem>
      );
    }
    return (
      <ListItem key={clientId}>
        <div>{index + 1}</div>
        <div>{name}</div>
        <div>{score}</div>
      </ListItem>
    );
  });

  return (
    <Container>
      <Header>
        <UpArrowIcon />
        <div>Back</div>
      </Header>
      <Group>
        <BigText>Leaderboard</BigText>
        <ListItemContainer>{listItems}</ListItemContainer>
      </Group>
    </Container>
  );
};

export default Leaderboard;
