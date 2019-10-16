import React, { ReactElement, useEffect, useState } from 'react';

import { Channel } from 'phoenix';
import RoomContainer, { ErrorCause } from '../components/RoomContainer';
import Button from '../components/common/Button';


const RoomPage: React.FC = () => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  function renderer(newChannel: Channel | null, error: [ErrorCause, any] | null): ReactElement {
    if (error != null) {
      const [cause, _] = error;
      return <p>Error: {cause}</p>;
    }
    if (newChannel == null) {
      return <p>Establishing connection...</p>;
    }
    if (channel == null) setChannel(newChannel);
    console.log('renderer', messages);
    return (
      <div>
        <Button onClick={() => newChannel.push('shout', { message: 'Wow!' })}>Shout</Button>
        <h2>Messages</h2>
        {messages.map((message: string) => (<p>{message}</p>))}
      </div>
    );
  }

  useEffect(() => {
    if (channel == null) return;
    channel.on(
      'shout',
      ({ message }: { message: string }) => {
        setMessages(existingMessages => [...existingMessages, message]);
      },
    );
  }, [channel]);

  return <RoomContainer roomId="lobby" render={renderer} />;
};

export default RoomPage;
