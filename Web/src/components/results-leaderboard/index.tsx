import React, { useState, useEffect } from 'react';
import Results from './Results';
import Leaderboard from './Leaderboard';
import { PlayerScore } from './PlayerScore';

interface ResultsLeaderboardProps {
  clientID: string,
  gameText: string,
  scores: PlayerScore[],
}

const ResultsLeaderboard: React.FC<ResultsLeaderboardProps> = ({ clientID, gameText, scores }) => {
  const [sortedScores, setSortedScores] = useState<PlayerScore[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [myScore, setMyScore] = useState(0);

  useEffect(() => {
    // TODO: sort scores
    const sorted:PlayerScore[] = [{ ID: 'Julius', score: 123 }, { ID: 'LJ', score: 23 }];
    setSortedScores(sorted);
    const idx = sorted.findIndex((score) => score.ID === clientID);
    if (idx === -1) {
      throw new Error('clientID not found in scores');
    }
    setMyRank(idx + 1);
    setMyScore(sorted[idx].score);
  }, [clientID, scores]);

  return (
    <>
      <Results
        score={myScore}
        gameText={gameText}
        rank={myRank}
        numPlayers={sortedScores.length}
      />
      <Leaderboard
        clientID={clientID}
        sortedScores={sortedScores}
      />
    </>
  );
};


export default ResultsLeaderboard;
