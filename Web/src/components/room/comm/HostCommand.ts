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
