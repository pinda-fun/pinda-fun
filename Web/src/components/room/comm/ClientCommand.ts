/**
 * For commands usable by both host and non-host
 */

export enum ClientMessage {
  RESULT = 'result',
  FINISH = 'finish',
}

export interface ClientCommandPayload { }

export interface ClientCommandBase<T extends ClientCommandPayload> {
  message: ClientMessage,
  payload: T,
}

type ClientCommand = ResultClientCommand;

export default ClientCommand;

/* ResultClientCommand */
export interface ResultClientCommandPayload extends ClientCommandPayload {
  result: number[],
}

export interface ResultClientCommand extends ClientCommandBase<ResultClientCommandPayload> {
  message: ClientMessage.RESULT,
  payload: ResultClientCommandPayload,
}

/* FinishClientCommand */
export interface FinishClientCommandPayload extends ClientCommandPayload { }

export interface FinishClientCommand extends ClientCommandBase<FinishClientCommandPayload> {
  message: ClientMessage.FINISH,
  payload: FinishClientCommandPayload,
}
