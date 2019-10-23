import Database from './Database';
import HostCommand from './HostCommand';

export enum CommError {
  NoMorePin = 'NoMorePin',
  Timeout = 'Timeout',
  Other = 'Other',
}

export enum PushError {
  NoChannel = 'NoChannel',
  Timeout = 'Timeout',
  Other = 'Other',
}

export interface Handlers {
  setRoom?: React.Dispatch<React.SetStateAction<string | null>>,
  setError?: React.Dispatch<React.SetStateAction<CommError | null>>,
  setErrorDescription?: React.Dispatch<React.SetStateAction<string | null>>,
  setDatabase?: React.Dispatch<React.SetStateAction<Database | null>>,
}

export interface CommAttributes {
  room: string | null;
  error: CommError | null;
  errorDescription: string | null;
  database: Database | null;
}

/**
 * if successful then (room != null && database != null && error == null)
 * if (error == CommError.Other) then (errorDescription != null)
 */
export default interface Comm extends CommAttributes {
  register(handlers: Handlers): void
  createRoom(name: string, game: string): void
  joinRoom(pin: string, name: string, game?: string): void
  pushHostCommand(
    hostCommand: HostCommand,
    onOk?: (() => void),
    onError?: ((error: PushError, errorDescription: string | null) => void)
  ): void
}
