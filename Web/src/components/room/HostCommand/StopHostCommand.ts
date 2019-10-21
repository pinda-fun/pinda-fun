import { HostCommandPayload, HostCommand, HostMessage } from '.';

interface StopHostCommandPayload extends HostCommandPayload { }

export default interface StopHostCommand extends HostCommand<StopHostCommandPayload> {
  message: HostMessage.STOP,
  payload: StopHostCommandPayload,
}

export function createStopHostCommand(): StopHostCommand {
  return { message: HostMessage.STOP, payload: {} };
}
