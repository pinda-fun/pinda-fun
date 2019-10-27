/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */

import { Socket, Channel } from 'phoenix';
import isDeployPreview from 'utils/isDeployPreview';
import getClientId from 'utils/getClientId';
import Database from 'components/room/database/Database';
import PhoenixDatabase from 'components/room/database/phoenix/PhoenixDatabase';
import { HostMeta } from 'components/room/database/Meta';
import HostCommand from '../commands/HostCommand';
import Comm, { Handlers, noOpHandlers, CommAttributes } from '../Comm';
import { CommError, PushError } from '../Errors';

const SOCKET_URL = isDeployPreview()
  ? process.env.REACT_APP_WEBSOCKET_STAGING_URL!
  : process.env.REACT_APP_WEBSOCKET_URL!;

const TIMEOUT_DURATION = 5000;

enum ChannelResponse {
  OK = 'ok',
  ERROR = 'error',
  TIMEOUT = 'timeout'
}

interface PINReturnPayload {
  pin: string
}

interface ErrorPayload {
  reason: string
}

const customErrorMapping: { [reason: string]: CommError } = {
  'Ran out of PIN': CommError.NoMorePin,
};

const noOp = () => { };

export default class PhoenixComm implements Comm {
  private room: string | null;

  private error: CommError | null;

  private errorDescription: string | null;

  private database: Database | null;

  private channel: Channel | null;

  private socket: Socket;

  private handlers: Handlers;

  constructor() {
    this.room = null;
    this.error = null;
    this.errorDescription = null;
    this.database = null;
    this.channel = null;
    this.handlers = noOpHandlers;

    this.socket = new Socket(SOCKET_URL, {
      params: { clientId: getClientId() },
      timeout: TIMEOUT_DURATION,
    });

    // Do not connect if we are testing
    if (process.env.NODE_ENV !== 'test') this.socket.connect();
  }

  register(handlers: Handlers): void {
    this.handlers = handlers;
  }

  private getUsers(): string[] {
    if (this.database == null) return [];
    return Object.values(this.database.getMetas()).map((meta) => meta.name);
  }

  private getHostMeta(): HostMeta | null {
    if (this.database == null) return null;
    return this.database.getHostMeta();
  }

  private flush(): void {
    const {
      setError,
      setErrorDescription,
      setRoom,
      setUsers,
      setHostMeta,
    } = this.handlers;
    if (setError) setError(this.error);
    if (setErrorDescription) setErrorDescription(this.errorDescription);
    if (setRoom) setRoom(this.room);
    if (setUsers) setUsers(this.getUsers());
    if (setHostMeta) setHostMeta(this.getHostMeta());
  }

  private cleanup(): void {
    if (this.channel != null) {
      this.channel.leave();
      this.socket.remove(this.channel);
    }
    this.channel = null;
    this.error = null;
    this.errorDescription = null;
    this.database = null;
    this.room = null;
    this.flush();
  }

  private joinChannel<T>(
    topic: string,
    channelPayload: object,
    onOk: (payload: T, newChannel: Channel, newDatabase: Database) => void,
  ): void {
    const newChannel = this.socket.channel(topic, channelPayload);
    const newDatabase = new PhoenixDatabase(newChannel);
    newDatabase.onSync(() => {
      this.flush();
    });

    newChannel
      .join()
      .receive(ChannelResponse.OK, (payload: T) => onOk(payload, newChannel, newDatabase))
      .receive(ChannelResponse.ERROR, ({ reason }: ErrorPayload) => {
        newChannel.leave();
        this.socket.remove(newChannel);
        if (reason in customErrorMapping) {
          this.error = customErrorMapping[reason];
        } else {
          this.error = CommError.Other;
          this.errorDescription = reason;
        }
        this.flush();
      })
      .receive(ChannelResponse.TIMEOUT, () => {
        this.error = CommError.Timeout;
        this.flush();
      });
  }

  createRoom(name: string, game: string): void {
    this.cleanup();
    this.joinChannel<PINReturnPayload>('room:lobby', {}, ({ pin }) => {
      this.leaveRoom();
      this.joinRoom(pin, name, game);
    });
  }

  joinRoom(pin: string, name: string, game?: string | undefined): void {
    this.cleanup();
    const joinPayload = game === undefined ? { name } : { name, game };
    this.joinChannel(
      `room:${pin}`,
      joinPayload,
      (_, newChannel, newDatabase) => {
        this.database = newDatabase;
        this.channel = newChannel;
        this.room = pin;
        this.flush();
      },
    );
  }

  leaveRoom(): void {
    if (this.channel != null) {
      this.channel.leave();
      this.socket.remove(this.channel);
    }
    this.cleanup();
  }

  pushHostCommand(
    { message, payload }: HostCommand,
    onOk?: (() => void) | undefined,
    onError?:
    | ((error: PushError, errorDescription: string | null) => void)
    | undefined,
  ): void {
    if (this.channel == null) {
      if (onError) onError(PushError.NoChannel, null);
      return;
    }
    this.channel
      .push(message, payload)
      .receive(ChannelResponse.OK, onOk || noOp)
      .receive(
        ChannelResponse.ERROR,
        ({ reason }: ErrorPayload) => (onError || noOp)(PushError.Other, reason),
      )
      .receive(ChannelResponse.TIMEOUT, () => (onError || noOp)(PushError.Timeout, null));
  }

  getAttributes(): CommAttributes {
    const { room, error, errorDescription } = this;
    const users = this.getUsers();
    const hostMeta = this.getHostMeta();

    return {
      room,
      error,
      errorDescription,
      users,
      hostMeta,
    };
  }

  sendResult(result: number[]): void {
    throw new Error('Method not implemented.');
  }

  onGameStart(handler: () => void): void {
    throw new Error('Method not implemented.');
  }

  onGameEnd(handler: () => void): void {
    throw new Error('Method not implemented.');
  }

  prepare(): void {
    throw new Error('Method not implemented.');
  }
}
