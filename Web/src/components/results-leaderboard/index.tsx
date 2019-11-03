import React from 'react';
import { ResultMap } from 'components/room/comm/Comm';
import getClientId from 'utils/getClientId';
import Game from 'components/room/Games';
import Results from './Results';
import Leaderboard, { PlayerScore } from './Leaderboard';

interface ResultsLeaderboardProps {
  allMetas: ResultMap | null,
  game: Game,
}

const ResultsLeaderboard: React.FC<ResultsLeaderboardProps> = ({ allMetas, game }) => {
  if (!allMetas) {
    return null;
  }

  const sortedScores: PlayerScore[] = Object
    .entries(allMetas)
    // TODO: is it fair to use the first number as the result to sort and display?
    .map(([clientId, { name, result }]) => (
      { clientId, name, score: result ? result[0] : 0 }
    ))
    .sort((a, b) => (a.score > b.score ? -1 : 1));

  const index = sortedScores.findIndex((playerScore) => playerScore.clientId === getClientId());
  const myScore = index >= 0 ? sortedScores[index].score : 0;
  const myRank = index >= 0 ? index + 1 : '??';

  return (
    <>
      <Results
        score={myScore}
        gameText={myScore === 1 ? game.toString() : `${game.toString()}s`}
        rank={myRank}
        numPlayers={sortedScores.length}
      />
      <Leaderboard
        playerScores={sortedScores}
      />
    </>
  );
};

export default ResultsLeaderboard;
