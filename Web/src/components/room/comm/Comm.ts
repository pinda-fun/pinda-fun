import HostCommand from './HostCommand';
import { CommError, PushError } from './Errors';
import { HostMeta } from '../database/Meta';

export interface CommAttributes {
  room: string | null,
  error: CommError | null,
  errorDescription: string | null,
  users: string[],
  hostMeta: HostMeta | null,
}

export interface Handlers {
  setRoom: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<CommError | null>>,
  setErrorDescription: React.Dispatch<React.SetStateAction<string | null>>,
  setUsers: React.Dispatch<React.SetStateAction<string[]>>,
  setHostMeta: React.Dispatch<React.SetStateAction<HostMeta | null>>,
}

const noOp = () => { };
export const noOpHandlers = {
  setRoom: noOp,
  setError: noOp,
  setErrorDescription: noOp,
  setUsers: noOp,
  setHostMeta: noOp,
};

/**
 * if successful then (room != null && database != null && error == null)
 * if (error == CommError.Other) then (errorDescription != null)
 */
export default interface Comm {
  getAttributes(): CommAttributes
  register(handlers: Handlers): void
  createRoom(name: string, game: string): void
  joinRoom(pin: string, name: string, game?: string): void
  leaveRoom(): void
  pushHostCommand(
    hostCommand: HostCommand,
    onOk?: () => void,
    onError?: (error: PushError, errorDescription: string | null) => void
  ): void
  getAttributes(): CommAttributes
}
