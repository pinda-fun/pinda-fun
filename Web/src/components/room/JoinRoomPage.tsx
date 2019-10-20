import React, { useState } from 'react';
import Button from 'components/common/Button';
import useErrorableChannel from './hooks/useErrorableChannel';

const JoinRoomPage: React.FC = () => {
  const [pin, setPin] = useState<string | null>(null);
  const { channel, error } = useErrorableChannel(pin);

  const buttonHandler = () => {
    const newPin = prompt('PIN number?', '') || '';
    if (newPin.length < 4) {
      alert('PIN too short');
      return;
    }
    setPin(`room:${newPin}`);
  };
  return (
    <div>
      {error != null && (<p>Error: {error[0].toString()}: {error[1].reason}</p>)}
      {error == null && channel != null && (<p>Connected!</p>)}
      <Button onClick={buttonHandler}>Join Room</Button>
    </div>
  );
};

export default JoinRoomPage;
