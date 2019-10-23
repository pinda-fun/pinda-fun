import { Socket, Channel } from 'phoenix';
import isDeployPreview from 'utils/isDeployPreview';
import getClientId from 'utils/getClientId';
import { useRef, useState } from 'react';
import Comm, { CommError, PushError } from './Comm';
import Database from './Database';
import ChannelResponse from './hooks/ChannelResponse';
import HostCommand from './HostCommand';

const SOCKET_URL = isDeployPreview()
  ? process.env.REACT_APP_WEBSOCKET_STAGING_URL!
  : process.env.REACT_APP_WEBSOCKET_URL!;

const TIMEOUT_DURATION = 5000;

function createSocket(): Socket {
  const socket = new Socket(
    SOCKET_URL,
    { params: { clientId: getClientId() }, timeout: TIMEOUT_DURATION },
  );
  socket.connect();
  return socket;
}

interface PINReturnPayload {
  pin: string
}

interface ErrorPayload {
  reason: string
}

const customErrorMapping: { [reason: string]: CommError } = { 'Ran out of PIN': CommError.NoMorePin };

export function usePhoenixComm(): Comm {
  const socket = useRef(createSocket()).current;
  const [channel, setChannel] = useState<Channel | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [error, setError] = useState<CommError | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  const cleanup = () => {
    setChannel(oldChannel => {
      if (oldChannel != null) {
        oldChannel.leave();
        socket.remove(oldChannel);
      }
      return null;
    });
    setError(null);
    setErrorDescription(null);
    setDatabase(null);
    setRoom(null);
  };

  const joinChannel = <T>(
    topic: string,
    channelPayload: object,
    onOk: (payload: T, newChannel: Channel, newDatabase: Database) => void,
  ): void => {
    const newChannel = socket.channel(topic, channelPayload);
    const newDatabase = new Database(newChannel);

    newChannel
      .join()
      .receive(ChannelResponse.OK, (payload: T) => onOk(payload, newChannel, newDatabase))
      .receive(ChannelResponse.ERROR, ({ reason }: ErrorPayload) => {
        newChannel.leave();
        socket.remove(newChannel);
        if (reason in customErrorMapping) {
          setError(customErrorMapping[reason]);
        } else {
          setError(CommError.Other);
          setErrorDescription(reason);
        }
      })
      .receive(ChannelResponse.TIMEOUT, () => setError(CommError.Timeout));
  };

  const joinRoom = (pin: string, name: string) => {
    cleanup();
    joinChannel(`room:${pin}`, { name }, (_, newChannel, newDatabase) => {
      setDatabase(newDatabase);
      setChannel(newChannel);
    });
  };

  const createRoom = (name: string) => {
    cleanup();
    joinChannel<PINReturnPayload>('room:lobby', {}, ({ pin }) => joinRoom(pin, name));
  };


  const pushHostCommand = (
    { message, payload }: HostCommand,
    onOk: (() => void) | undefined,
    onError: ((error: PushError, errorDescription: string | null) => void) | undefined,
  ) => {
    if (channel == null) {
      if (onError !== undefined) onError(PushError.NoChannel, null);
      return;
    }
    const push = channel.push(message, payload);

    if (onOk !== undefined) push.receive(ChannelResponse.OK, onOk);

    if (onError !== undefined) {
      push
        .receive(
          ChannelResponse.ERROR,
          ({ reason }: ErrorPayload) => onError(PushError.Other, reason),
        )
        .receive(ChannelResponse.TIMEOUT, () => onError(PushError.Timeout, null));
    }
  };

  return {
    room, error, errorDescription, database, createRoom, joinRoom, pushHostCommand,
  };
}
