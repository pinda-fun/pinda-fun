import React, { useState, useEffect } from 'react';
import { ResultMap } from 'components/room/comm/Comm';
import getClientId from 'utils/getClientId';
import ResultsPage from './Results';
import Leaderboard, { PlayerScore } from './Leaderboard';

interface ResultsLeaderboardProps {
  allMetas: ResultMap | null,
  gameText: string,
}

const ResultsLeaderboard: React.FC<ResultsLeaderboardProps> = ({ allMetas, gameText }) => {
  const [sortedScores, setSortedScores] = useState<PlayerScore[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [myScore, setMyScore] = useState(0);

  useEffect(() => {
    if (!allMetas) return;

    const sorted: PlayerScore[] = Object
      .entries(allMetas)
      // TODO: is it fair to use the first number as the result to sort and display?
      .map(([clientId, { name, result }]) => (
        { clientId, name, score: result ? result[0] : 0 }
      ))
      .sort((a, b) => (a.score > b.score ? -1 : 1));

    const idx = sorted.findIndex((playerScore) => playerScore.clientId === getClientId());
    if (idx === -1) {
      throw new Error('clientID not found in scores');
    }
    setMyRank(idx + 1);
    setMyScore(sorted[idx].score);
    setSortedScores(sorted);
  }, [allMetas]);

  return (
    <>
      <ResultsPage
        score={myScore}
        gameText={gameText}
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
