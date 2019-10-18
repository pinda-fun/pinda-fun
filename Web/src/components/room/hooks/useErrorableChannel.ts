import { useState, useEffect } from 'react';
import { Socket, Channel } from 'phoenix';

import getClientId from '../../../utils/getClientId';
import ChannelResponse from './ChannelResponse';
import ErrorCause from './ErrorCause';

const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL!;
const TIMEOUT_DURATION = 5000;

/**
 * if (error != null) { There is an error }
 * else if (channel == null) { Connecting }
 * else { Channel ready to use }
 */
export interface ErrorableChannel<T> {
  channel: Channel | null,
  error: [ErrorCause, any] | null,
  joinPayload: T | null,
}

function maybeReconnectSocket(maybeSocket: Socket | null): Socket {
  if (maybeSocket != null && maybeSocket.isConnected()) return maybeSocket;
  const newSocket = new Socket(
    SOCKET_URL,
    { params: { clientId: getClientId() }, timeout: TIMEOUT_DURATION },
  );
  newSocket.connect();
  return newSocket;
}

export default function useErrorableChannel<T>(channelId: string): ErrorableChannel<T> {
  const [_, setSocket] = useState<Socket | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<[ErrorCause, any] | null>(null);
  const [joinPayload, setJoinPayload] = useState<T | null>(null);

  useEffect(() => {
    setSocket(oldSocket => {
      const currentSocket = maybeReconnectSocket(oldSocket);

      const newChannel = currentSocket.channel(channelId);

      newChannel
        .join()
        .receive(ChannelResponse.OK, (payload: T) => {
          setJoinPayload(payload);
          setChannel(oldChannel => {
            if (oldChannel != null) oldChannel.leave();
            return newChannel;
          });
        })
        .receive(ChannelResponse.ERROR, reasons => setError([ErrorCause.Other, reasons]))
        .receive(ChannelResponse.TIMEOUT, () => setError([ErrorCause.Timeout, null]));

      return currentSocket;
    });
  }, [channelId]);

  return { channel, error, joinPayload };
}
