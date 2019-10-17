import React, { useEffect, useState } from 'react';

import useErrorableChannel from './hooks/useErrorableChannel';
import Button from '../common/Button';

enum State {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}


const RoomPage: React.FC = () => {
  const { channel, error } = useErrorableChannel('room:5432');
  const [state, setState] = useState<State>(State.PENDING);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    if (channel == null) return;
    channel.on('startGame', () => setState(State.IN_PROGRESS));
    channel.on('result', ({ newResult }) => {
      console.log(newResult);
      setState(State.COMPLETED);
      setResult(newResult);
    });
  }, [channel]);

  if (error != null) {
    const [cause, _] = error;
    return <p>Error: {cause}</p>;
  }
  if (channel == null) {
    return <p>Establishing connection...</p>;
  }

  const buttonHandler = () => {
    channel.push('startGame', {});
  };
  const scoreButtonHandler = () => {
    const score = parseInt(prompt('What score?') || '0', 10);
    channel.push('result', { score });
  };

  return (
    <div>
      <Button onClick={buttonHandler}>Start</Button>
      <Button onClick={scoreButtonHandler}>Send Score</Button>
      <p>State: {state.toString()}</p>
      <p>Result: {result}</p>
    </div>
  );
};

export default RoomPage;
