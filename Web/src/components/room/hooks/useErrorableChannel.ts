import { useState, useEffect, useRef } from 'react';
import { Socket, Channel } from 'phoenix';

import isDeployPreview from 'utils/isDeployPreview';
import getClientId from '../../../utils/getClientId';
import ChannelResponse from './ChannelResponse';
import ErrorCause from './ErrorCause';
import Database from '../Database';


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
  database: Database | null,
}


/**
 * @param channelId if null, will not establish connection.
 */
export default function useErrorableChannel<T extends object | undefined, U extends object>(
  channelId: string | null,
  payload: T,
): ErrorableChannel<U> {
  const socketRef = useRef<Socket | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<[ErrorCause, any] | null>(null);
  const [returnPayload, setReturnPayload] = useState<U | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  const maybeReconnectSocket = (): Socket => {
    const socket = socketRef.current;
    if (socket != null && socket.isConnected()) return socket;
    const newSocket = new Socket(
      SOCKET_URL,
      { params: { clientId: getClientId() }, timeout: TIMEOUT_DURATION },
    );
    newSocket.connect();
    socketRef.current = newSocket;
    return newSocket;
  };

  useEffect(() => {
    if (channelId == null) {
      setError(null);
      setReturnPayload(null);
      setDatabase(null);
      setChannel(null);
      return undefined;
    }
    const socket = maybeReconnectSocket();

    const newChannel = socket.channel(channelId, payload);
    const newDatabase = new Database(newChannel);

    newChannel
      .join()
      .receive(ChannelResponse.OK, (currentReturnPayload: U) => {
        setError(null);
        setReturnPayload(currentReturnPayload);
        setDatabase(newDatabase);
        setChannel(newChannel);
      })
      .receive(ChannelResponse.ERROR, reasons => {
        setError([ErrorCause.Other, reasons]);
        newChannel.leave();
        socket.remove(newChannel);
      })
      .receive(ChannelResponse.TIMEOUT, () => setError([ErrorCause.Timeout, null]));

    return () => {
      newChannel.leave();
      socket.remove(newChannel);
    };
    // Payload is not a dependency because we only want to change channel on channelId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  return {
    channel, error, returnPayload, database,
  };
}
