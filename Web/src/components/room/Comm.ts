import Database from './Database';
import HostCommand from './HostCommand';

export enum CommError {
  NoMorePin,
  Timeout,
  Other,
}

export enum PushError {
  NoChannel,
  Timeout,
  Other
}

/**
 * if successful then (room != null && database != null && error == null)
 * if (error == CommError.Other) then (errorDescription != null)
 */
export default interface Comm {
  room: string | null;
  error: CommError | null;
  errorDescription: string | null;
  database: Database | null;

  createRoom(name: string): void
  joinRoom(pin: string, name: string): void
  pushHostCommand(
    hostCommand: HostCommand,
    onOk: (() => void) | undefined,
    onError: ((error: PushError, errorDescription: string | null) => void) | undefined
  ): void
}
