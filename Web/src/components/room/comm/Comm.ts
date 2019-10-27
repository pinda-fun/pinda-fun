import { CommError, PushError } from './Errors';
import { HostMeta } from '../database/Meta';
import Game from '../Games';

export interface ResultMap {
  [name: string]: number[],
}

export const resultsExist = (res: ResultMap | null): res is ResultMap => Boolean(
  res && Object.values(res)[0] && Object.values(res)[0].length,
);

export interface CommAttributes {
  room: string | null,
  error: CommError | null,
  errorDescription: string | null,
  users: string[],
  hostMeta: HostMeta | null,
  results: ResultMap | null,
}

export interface Handlers {
  setRoom: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<CommError | null>>,
  setErrorDescription: React.Dispatch<React.SetStateAction<string | null>>,
  setUsers: React.Dispatch<React.SetStateAction<string[]>>,
  setHostMeta: React.Dispatch<React.SetStateAction<HostMeta | null>>,
  setResults: React.Dispatch<React.SetStateAction<ResultMap | null>>,
}

const noOp = () => { };
export const noOpHandlers = {
  setRoom: noOp,
  setError: noOp,
  setErrorDescription: noOp,
  setUsers: noOp,
  setHostMeta: noOp,
  setResults: noOp,
};

export type PushErrorHandler = (error: PushError, errorDescription: string | null) => void;

/**
 * if successful then (room != null && database != null && error == null)
 * if (error == CommError.Other) then (errorDescription != null)
 */
export default interface Comm {
  createRoom(name: string, game: string): void
  joinRoom(pin: string, name: string, game?: string): void
  leaveRoom(): void

  // For useCommHooks use
  _register(handlers: Handlers): void
  _getAttributes(): CommAttributes

  /* RFC #108 */

  // For Client
  /**
   * Sends current result
   */
  sendResult(result: number[], onError?: PushErrorHandler): void

  // Host
  prepare(onOk?: () => void, onError?: PushErrorHandler): void
  changeGame(game: Game, onOk?: () => void, onError?: PushErrorHandler): void

  // For useCommHooks use
  // Client callbacks
  /**
   * `handler` is invoked whenever the game starts
   * (GameState changed to ONGOING, when all clients are ready)
   * Don't forget to add destructor `comm.onGameStart(() => { })`
   */
  _onGameStart(handler: () => void): void
  /**
   * `handler` is invoked whenver the game stops
   * (GameState changed to FINISHED, when all clients updated their results)
   * Don't forget to add destructor `comm.onGameStart(() => { })`
   */
  _onGameEnd(handler: () => void): void

}
