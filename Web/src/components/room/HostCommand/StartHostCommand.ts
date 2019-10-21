import { HostCommand, HostCommandPayload, HostMessage } from '.';

interface StartHostCommandPayload extends HostCommandPayload { }

export default interface StartHostCommand extends HostCommand<StartHostCommandPayload> {
  message: HostMessage.START,
  payload: StartHostCommandPayload,
}

export function createStartHostCommand(): StartHostCommand {
  return { message: HostMessage.START, payload: {} };
}
