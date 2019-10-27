import Database from 'components/room/database/Database';
import HostCommand from './commands/HostCommand';
import { CommError, PushError } from './Errors';

export interface CommAttributes {
  room: string | null;
  error: CommError | null;
  errorDescription: string | null;
  database: Database | null;
}

export interface Handlers {
  setRoom: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<CommError | null>>,
  setErrorDescription: React.Dispatch<React.SetStateAction<string | null>>,
  setDatabase: React.Dispatch<React.SetStateAction<Database | null>>,
}

const noOp = () => { };
export const noOpHandlers = {
  setRoom: noOp, setError: noOp, setErrorDescription: noOp, setDatabase: noOp,
};

/**
 * if successful then (room != null && database != null && error == null)
 * if (error == CommError.Other) then (errorDescription != null)
 */
export default interface Comm {
  register(handlers: Handlers): void
  createRoom(name: string, game: string): void
  joinRoom(pin: string, name: string, game?: string): void
  leaveRoom(): void
  pushHostCommand(
    hostCommand: HostCommand,
    onOk?: (() => void),
    onError?: ((error: PushError, errorDescription: string | null) => void)
  ): void

  /* RFC #108 */
  // For Client
  sendResult(result: number[]): void
  // Client callback
  onGameStart(handler: () => void): void
  onGameEnd(handler: () => void): void
  // Host
  prepare(): void
}
