import { Channel, Push } from 'phoenix';

export enum HostMessage {
  START = 'start',
  STOP = 'stop',
}

export interface HostCommandPayload { }

export interface HostCommand<T extends HostCommandPayload> {
  message: HostMessage,
  payload: T,
}

/**
 * For type safety, when calling this function please explicitly specify the type parameter, e.g.
 *
 * pushHostCommand<StartHostCommand>(createStartHostCommand(), channel);
 */
export function pushHostCommand<T extends HostCommandPayload>(
  hostCommand: HostCommand<T>,
  channel: Channel,
): Push {
  const { message, payload } = hostCommand;
  return channel.push(message, payload);
}
