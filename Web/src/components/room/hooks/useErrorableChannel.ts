import { useState, useEffect } from 'react';
import { Socket, Channel, Presence } from 'phoenix';

import isDeployPreview from 'utils/isDeployPreview';
import getClientId from '../../../utils/getClientId';
import ChannelResponse from './ChannelResponse';
import ErrorCause from './ErrorCause';


// Use staging is we're inside a Netlify deploy preview
const SOCKET_URL = isDeployPreview()
  ? process.env.REACT_APP_WEBSOCKET_STAGING_URL!
  : process.env.REACT_APP_WEBSOCKET_URL!;

const TIMEOUT_DURATION = 5000;

/**
 * if (channelId == null) { No connection }
 * else if (error != null) { There is an error }
 * else if (channel == null) { Connecting }
 * else { Channel ready to use }
 */
export interface ErrorableChannel<T> {
  channel: Channel | null,
  error: [ErrorCause, any] | null,
  returnPayload: T | null,
  presence: Presence | null,
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

/**
 * @param channelId if null, will not establish connection.
 */
export default function useErrorableChannel<T extends object, U extends object>(
  channelId: string | null,
  payload: T,
): ErrorableChannel<U> {
  const [_, setSocket] = useState<Socket | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<[ErrorCause, any] | null>(null);
  const [returnPayload, setReturnPayload] = useState<U | null>(null);
  const [presence, setPresence] = useState<Presence | null>(null);

  useEffect(() => {
    if (channelId == null) {
      setSocket(oldSocket => {
        setError(null);
        setReturnPayload(null);
        setPresence(null);
        setChannel(oldChannel => {
          if (oldChannel != null) {
            oldChannel.leave();
            if (oldSocket != null) oldSocket.remove(oldChannel);
          }
          return null;
        });
        if (oldSocket != null) oldSocket.disconnect();
        return null;
      });
      return;
    }
    setSocket(oldSocket => {
      const currentSocket = maybeReconnectSocket(oldSocket);

      const newChannel = currentSocket.channel(channelId, payload);
      const newPresence = new Presence(newChannel);

      newChannel
        .join()
        .receive(ChannelResponse.OK, (currentReturnPayload: U) => {
          setError(null);
          setReturnPayload(currentReturnPayload);
          setPresence(newPresence);
          setChannel(oldChannel => {
            if (oldChannel != null) {
              oldChannel.leave();
              currentSocket.remove(oldChannel);
            }
            return newChannel;
          });
        })
        .receive(ChannelResponse.ERROR, reasons => {
          setError([ErrorCause.Other, reasons]);
          newChannel.leave();
          currentSocket.remove(newChannel);
        })
        .receive(ChannelResponse.TIMEOUT, () => setError([ErrorCause.Timeout, null]));

      return currentSocket;
    });
  }, [channelId]);

  return {
    channel, error, returnPayload, presence,
  };
}
