import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { Socket, Channel } from "phoenix";
import uuidv4 from "uuid/v4";

const SOCKET_URL = "ws://localhost:4000/socket";
const TIMEOUT_DURATION = 5000;

const CLIENT_ID_LOCAL_STORAGE_KEY = "client_id";

const CHANNEL_JOIN_OK = "Channel %s: Joined channel";
const CHANNEL_JOIN_ERROR = "Channel %s: Failed to join";
const CHANNEL_JOIN_TIMEOUT = "Channel %s: Timeout";
const NO_CHANNEL = "Not connected to any channel";

interface RoomProps {
  roomId: string;
}

enum ChannelResponse {
  OK = "ok",
  ERROR = "error",
  TIMEOUT = "timeout"
}

enum GameType {
  ShakeMeUp = 0
}

enum EventType {
  GameFinished = "gameFinishedEvent"
}

abstract class SocketMessage {
  abstract type: EventType;
  abstract payload: object;
}

class GameFinishedMessage extends SocketMessage {
  type: EventType = EventType.GameFinished;
  payload: number[];

  constructor(results: number[]) {
    super();
    this.type = EventType.GameFinished;
    this.payload = results;
  }
}

const getClientId = () => {
  const maybeClientId = localStorage.getItem(CLIENT_ID_LOCAL_STORAGE_KEY);
  if (maybeClientId == null) {
    const clientId = uuidv4();
    localStorage.setItem(CLIENT_ID_LOCAL_STORAGE_KEY, clientId);
    return clientId;
  } else {
    return maybeClientId;
  }
};

export const Room: FunctionComponent<RoomProps> = (props: RoomProps) => {
  const clientId = getClientId();
  const [socket, setSocket] = useState<null | Socket>(null);
  const [channel, setChannel] = useState<null | Channel>(null);
  const channelRef = useRef(channel);
  const [game, setGame] = useState<null | GameType>(null);
  const gameType = useRef(game);

  /**** HANDLERS ****/
  const handleConnect = (message: string): void => {
    console.log(CHANNEL_JOIN_OK, message);
  };

  /**** METHODS ****/
  const connectSocket = (): void => {
    const socket = new Socket(SOCKET_URL, { params: { clientId } });
    socket.connect();
    setSocket(socket);
  };

  const changeChannel = () => {
    if (socket == null) return;
    const newChannel = socket.channel("room:".concat(props.roomId));
    newChannel
      .join(TIMEOUT_DURATION)
      .receive(ChannelResponse.OK, handleConnect)
      .receive(ChannelResponse.ERROR, ({ reason }) =>
        console.log(CHANNEL_JOIN_ERROR, reason)
      )
      .receive(ChannelResponse.TIMEOUT, () =>
        console.log(CHANNEL_JOIN_TIMEOUT)
      );

    setChannel(newChannel);

    return () => {
      newChannel.leave();
    };
  };

  const sendMessage = (socketMessage: SocketMessage): void => {
    if (!channelRef || !channelRef.current) {
      throw new Error(NO_CHANNEL);
    }

    channelRef.current.push(
      socketMessage.type,
      socketMessage.payload,
      TIMEOUT_DURATION
    );
  };

  /**** CALLBACKS ****/
  const submitResults = (results: number[]): void => {
    const message: SocketMessage = new GameFinishedMessage(results);
    sendMessage(message);
  };

  useEffect(connectSocket, []);
  useEffect(changeChannel, [props.roomId]);

  return (
    <div>
      {/* hot swap game */}
      {/* <ShakeMeUp submit={submitResults} /> */}
    </div>
  );
};

export default Room;
