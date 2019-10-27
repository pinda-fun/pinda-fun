/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */

import { Socket, Channel } from 'phoenix';
import isDeployPreview from 'utils/isDeployPreview';
import getClientId from 'utils/getClientId';
import Database from 'components/room/database/Database';
import PhoenixDatabase from 'components/room/database/phoenix/PhoenixDatabase';
import { HostMeta } from 'components/room/database/Meta';
import HostCommand, { HostMessage } from '../commands/HostCommand';
import Comm, {
  Handlers, noOpHandlers, CommAttributes, PushErrorHandler, ResultMap,
} from '../Comm';
import { CommError, PushError } from '../Errors';
import ClientCommand, { ClientMessage } from '../commands/ClientCommand';
import GameState from '../GameState';

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

  private gameStartHandler: () => void;

  private gameStopHandler: () => void;

  constructor() {
    this.room = null;
    this.error = null;
    this.errorDescription = null;
    this.database = null;
    this.channel = null;
    this.handlers = noOpHandlers;
    this.gameStartHandler = noOp;
    this.gameStopHandler = noOp;

    this.socket = new Socket(SOCKET_URL, {
      params: { clientId: getClientId() },
      timeout: TIMEOUT_DURATION,
    });

    // Do not connect if we are testing
    if (process.env.NODE_ENV !== 'test') this.socket.connect();
  }

  _register(handlers: Handlers): void {
    this.handlers = handlers;
  }

  private getUsers(): string[] {
    if (this.database == null) return [];
    return Object.values(this.database.getMetas()).map(({ name }) => name);
  }

  private getHostMeta(): HostMeta | null {
    if (this.database == null) return null;
    return this.database.getHostMeta();
  }

  private getResults(): ResultMap | null {
    if (this.database == null) return null;
    return Object.fromEntries(
      Object.values(this.database.getMetas()).map(({ name, result }) => [name, result || []]),
    );
  }

  private flush(): void {
    const {
      setError,
      setErrorDescription,
      setRoom,
      setUsers,
      setHostMeta,
      setResults,
    } = this.handlers;
    if (setError) setError(this.error);
    if (setErrorDescription) setErrorDescription(this.errorDescription);
    if (setRoom) setRoom(this.room);
    if (setUsers) setUsers(this.getUsers());
    if (setHostMeta) setHostMeta(this.getHostMeta());
    if (setResults) setResults(this.getResults());
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

  private handleStateChange(oldState: GameState, newState: GameState): void {
    // State transition handler for client
    if (oldState === GameState.FINISHED && newState === GameState.PREPARE) {
      this.pushClientCommand(
        { message: ClientMessage.RESULT, payload: { result: null } },
        noOp,
        noOp,
      );
    } else if (oldState === GameState.PREPARE && newState === GameState.ONGOING) {
      this.gameStartHandler();
    } else if (oldState === GameState.ONGOING && newState === GameState.FINISHED) {
      this.gameStopHandler();
    }
    if (this.database != null && this.database.hostId === getClientId()) this.hostWatcher(newState);
  }

  private hostWatcher(state: GameState): void {
    if (this.database == null) return;
    if (state === GameState.PREPARE) {
      // `result` being null is indication that the client is ready
      const allReady = (Object
        .values(this.database.getMetas())
        .filter((meta) => meta.result != null)
        .length) === 0;
      if (allReady) {
        this.pushHostCommand(
          { message: HostMessage.STATE, payload: { state: GameState.ONGOING } },
          noOp,
          noOp,
        );
      }
    }
    if (state === GameState.ONGOING) {
      const allFinished = (Object
        .values(this.database.getMetas())
        .filter((meta) => meta.result == null)
        .length) === 0;
      if (allFinished) {
        this.pushHostCommand(
          { message: HostMessage.STATE, payload: { state: GameState.FINISHED } },
          noOp,
          noOp,
        );
      }
    }
  }

  private joinChannel<T>(
    topic: string,
    channelPayload: object,
    onOk: (payload: T, newChannel: Channel, newDatabase: Database) => void,
  ): void {
    const newChannel = this.socket.channel(topic, channelPayload);
    const newDatabase = new PhoenixDatabase(newChannel);
    newDatabase.onSync((oldHostMeta) => {
      const currentHostMeta = newDatabase.getHostMeta();
      // Disconnect if we join when the state is not FINISHED
      if (oldHostMeta == null && currentHostMeta != null
        && currentHostMeta.state !== GameState.FINISHED) {
        this.leaveRoom();
        this.error = CommError.RoomNotAccepting;
        this.flush();
        return;
      }
      if (oldHostMeta != null && currentHostMeta != null) {
        this.handleStateChange(oldHostMeta.state, currentHostMeta.state);
      }
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

  private pushCommand(
    { message, payload }: { message: string, payload: object },
    onOk: () => void,
    onError: PushErrorHandler,
  ) {
    if (this.channel == null) {
      onError(PushError.NoChannel, null);
      return;
    }
    this.channel
      .push(message, payload)
      .receive(ChannelResponse.OK, onOk)
      .receive(ChannelResponse.ERROR, ({ reason }: ErrorPayload) => {
        onError(PushError.Other, reason);
      })
      .receive(ChannelResponse.TIMEOUT, () => onError(PushError.Timeout, null));
  }

  private pushHostCommand(command: HostCommand, onOk: () => void, onError: PushErrorHandler): void {
    this.pushCommand(command, onOk, onError);
  }

  private pushClientCommand(
    command: ClientCommand,
    onOk: () => void,
    onError: PushErrorHandler,
  ): void {
    this.pushCommand(command, onOk, onError);
  }

  _getAttributes(): CommAttributes {
    const { room, error, errorDescription } = this;
    const users = this.getUsers();
    const hostMeta = this.getHostMeta();
    const results = this.getResults();

    return {
      room,
      error,
      errorDescription,
      users,
      hostMeta,
      results,
    };
  }

  sendResult(result: number[], onError?: PushErrorHandler): void {
    this.pushClientCommand(
      { message: ClientMessage.RESULT, payload: { result } },
      noOp,
      onError || noOp,
    );
  }

  _onGameStart(handler: () => void): void {
    this.gameStartHandler = handler;
  }

  _onGameEnd(handler: () => void): void {
    this.gameStopHandler = handler;
  }

  prepare(onError?: PushErrorHandler): void {
    if (this.database == null) return;
    if (this.database.hostId !== getClientId()) return;
    const maybeHostMeta = this.database.getHostMeta();
    if (maybeHostMeta == null) return;
    if (maybeHostMeta.state !== GameState.FINISHED) {
      throw new Error(`Cannot invoke prepare() when state is ${maybeHostMeta.state.toString()}`);
    }
    this.pushHostCommand(
      { message: HostMessage.STATE, payload: { state: GameState.PREPARE } },
      noOp,
      onError || noOp,
    );
  }
}
