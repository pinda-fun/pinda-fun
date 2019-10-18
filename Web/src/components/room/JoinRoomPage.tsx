import React, { useState, useEffect } from 'react';
import Button from 'components/common/Button';
import useErrorableChannel from './hooks/useErrorableChannel';

const JoinRoomPage: React.FC = () => {
  const [pin, setPin] = useState<string | null>(null);
  const { channel, _error } = useErrorableChannel(`room:${pin}`);

  useEffect(() => {
    // if (channel == null) return;
  }, [channel]);

  const buttonHandler = () => {
    const newPin = prompt('PIN number?', '') || '';
    if (newPin.length < 4) {
      alert('PIN too short');
      return;
    }
    setPin(newPin);
  };
  return (
    <div>
      <Button onClick={buttonHandler}>Join Room</Button>
    </div>
  );
};

export default JoinRoomPage;
