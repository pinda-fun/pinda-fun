import React, { useEffect, useState } from 'react';

import useErrorableChannel from './hooks/useErrorableChannel';
import Button from '../common/Button';


const RoomPage: React.FC = () => {
  const { channel, error } = useErrorableChannel('room:lobby');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (channel == null) return;
    channel.on('shout', ({ message }) => setMessages(existingMessages => [...existingMessages, message]));
  }, [channel]);

  if (error != null) {
    const [cause, _] = error;
    return <p>Error: {cause}</p>;
  }
  if (channel == null) {
    return <p>Establishing connection...</p>;
  }

  const buttonHandler = () => {
    const message = prompt('What do you want to say?', '');
    channel.push('shout', { message });
  };

  return (
    <div>
      <Button onClick={buttonHandler}>Shout</Button>
      <h2>Messages</h2>
      {messages.map((message: string) => (<p>{message}</p>))}
    </div>
  );
};

export default RoomPage;
