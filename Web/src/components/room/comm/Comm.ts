import { CommError, PushError } from './Errors';
import Meta, { HostMeta } from '../database/Meta';
import Game from '../Games';

export interface ResultMap {
  [clientId: string]: Meta,
}

export const resultsExist = (res: ResultMap | null): res is ResultMap => {
  if (res == null) return false;
  const firstResult = Object.values(res)[0].result;
  return Boolean(firstResult !== null && firstResult.length);
};

export interface CommAttributes {
  room: string | null,
  error: CommError | null,
  errorDescription: string | null,
  users: string[],
  hostMeta: HostMeta | null,
  allMetas: ResultMap | null,
  myMeta: Meta | null,
}

/* RFC #147 */
export interface Feedback {
  game: Game,
  title: string,
  body: string,
  isGood: boolean
}

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
  _register(handler: (attributes: CommAttributes) => void): void
  _getAttributes(): CommAttributes

  /* RFC #108 */

  // For Client
  /**
   * Sends current result
   */
  readyUp(onOk?: () => void, onError?: PushErrorHandler): void
  sendResult(result: number[], onOk?: () => void, onError?: PushErrorHandler): void

  // Host
  prepare(onOk?: () => void, onError?: PushErrorHandler): void
  changeGame(game: Game, onOk?: () => void, onError?: PushErrorHandler): void
  refreshSeed(seed: string, onOk?: () => void, onError?: PushErrorHandler): void

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

  /* RFC #147 */
  submitFeedback(feedback: Feedback, onOk?: () => void, onError?: PushErrorHandler): void
}
