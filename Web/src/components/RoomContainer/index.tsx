import React, {
  useState, useEffect, EffectCallback, ReactElement,
} from 'react';
import { Socket, Channel } from 'phoenix';

import getClientId from '../../utils/getClientId';
import ChannelResponse from './ChannelResponse';

const SOCKET_URL = 'ws://localhost:4000/socket';
const TIMEOUT_DURATION = 5000;

export enum ErrorCause {
  Timeout = 'timeout',
  Other = 'other'
}

interface RoomProps {
  roomId: string,
  render: (channel: Channel | null, error: [ErrorCause, any] | null) => ReactElement,
}

const RoomContainer: React.FC<RoomProps> = (props: RoomProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<[ErrorCause, any] | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);

  const { roomId, render } = props;

  const maybeConnectSocket = () => {
    if (socket != null) return socket;
    const newSocket = new Socket(
      SOCKET_URL,
      { params: { clientId: getClientId() }, timeout: TIMEOUT_DURATION },
    );
    newSocket.connect();
    setSocket(newSocket);
    return newSocket;
  };

  const changeChannel: EffectCallback = () => {
    const currentSocket = maybeConnectSocket();
    const newChannel = currentSocket.channel('room:'.concat(roomId));
    newChannel
      .join()
      .receive(ChannelResponse.OK, () => setChannel(newChannel))
      .receive(ChannelResponse.ERROR, reasons => setError([ErrorCause.Other, reasons]))
      .receive(ChannelResponse.TIMEOUT, () => setError([ErrorCause.Timeout, null]));

    return () => { newChannel.leave(); };
  };

  useEffect(changeChannel, [roomId]);

  return render(channel, error);
};

export default RoomContainer;
