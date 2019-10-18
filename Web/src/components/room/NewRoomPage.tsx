import React, { useEffect, useState } from 'react';

import useErrorableChannel from './hooks/useErrorableChannel';
import Button from '../common/Button';

interface PINPayload {
  pin: string
}

const RoomPage: React.FC = () => {
  const [pin, setPin] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);
  const { channel, error, joinPayload } = useErrorableChannel<PINPayload>(channelName);

  useEffect(() => {
    if (channel == null) return;
    if (joinPayload != null) setPin(joinPayload.pin);
  }, [channel]);

  if (channelName != null) {
    if (error != null) {
      const [cause, _] = error;
      return <p>Error: {cause}</p>;
    }
    if (channelName != null && channel == null) {
      return <p>Establishing connection...</p>;
    }
  }

  const buttonHandler = () => {
    setChannelName('room:lobby');
  };

  return (
    <div>
      <p>Room: {pin || 'None'}</p>
      <Button onClick={buttonHandler}>Obtain PIN</Button>
    </div>
  );
};

export default RoomPage;
