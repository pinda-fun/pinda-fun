import { Channel, Push } from 'phoenix';

export enum HostMessage {
  START = 'start',
  STOP = 'stop',
}

export interface HostCommandPayload { }

export interface HostCommandBase<T extends HostCommandPayload> {
  message: HostMessage,
  payload: T,
}

type HostCommand = StartHostCommand | StopHostCommand;

export default HostCommand;

export function pushHostCommand(hostCommand: HostCommand, channel: Channel): Push {
  const { message, payload } = hostCommand;
  return channel.push(message, payload);
}

/* StartHostCommand */
export interface StartHostCommandPayload extends HostCommandPayload { }

export interface StartHostCommand extends HostCommandBase<StartHostCommandPayload> {
  message: HostMessage.START,
  payload: StartHostCommandPayload,
}

/* StopHostCommand */
export interface StopHostCommandPayload extends HostCommandPayload { }

export interface StopHostCommand extends HostCommandBase<StopHostCommandPayload> {
  message: HostMessage.STOP,
  payload: StopHostCommandPayload,
}
