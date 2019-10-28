import React from 'react';
import styled from 'styled-components';
import { ChevronUp } from 'react-feather';
import { VerticalContainer, HorizontalContainer } from './Containers';
import { PlayerScore } from './PlayerScore';

interface LeaderboardProps {
  clientID: string,
  sortedScores: PlayerScore[];
}

const BigText = styled.span`
  font-size: 2rem;
  font-family: var(--secondary-font);
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: sticky;
  top: 0px;
  text-align: center;
  width: 100vw;
  padding: 12px;

  font-size: 1rem;
`;

const UpArrowIcon = styled(ChevronUp)`
  width: 42px;
  height: 42px;
  viewBox: 0 0 10 10;
`;

const List = styled.div`
  background: var(--white);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 24px;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  color: black;
  font-size: 1.4rem;
`;

const ListItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding:18px 0 18px 0;
  border-width: 1px;
  border-color: var(--light-grey);
  border-style: solid;
`;

// separate component so we can have a more divergent styling in future
const SelectedListItem = styled.div`
  background: var(--pale-yellow);
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  padding:18px 0 18px 0;
  border-width: 1px;
  border-color: var(--light-grey);
  border-style: solid;
  color: var(--red);
`;

const Leaderboard: React.FC<LeaderboardProps> = ({ clientID, sortedScores: playerScores }) => {
  const listItems = playerScores.map((player, index) => {
    if (player.ID === clientID) {
      return (
        <SelectedListItem>
          <div>{index}</div>
          <div>{player.ID}</div>
          <div>{player.score}</div>
        </SelectedListItem>
      );
    }
    return (
      <ListItem>
        <div>{index}</div>
        <div>{player.ID}</div>
        <div>{player.score}</div>
      </ListItem>
    );
  });


  return (
    <VerticalContainer>
      <Header>
        <UpArrowIcon />
        Back
      </Header>
      <HorizontalContainer>
        <BigText>Leaderboard</BigText>
        <List>{listItems}</List>
      </HorizontalContainer>
    </VerticalContainer>
  );
};

export default Leaderboard;
