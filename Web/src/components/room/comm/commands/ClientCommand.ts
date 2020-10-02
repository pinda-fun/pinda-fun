export enum ClientMessage {
  RESULT = 'result',
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
  result: number[] | null,
}

export interface ResultClientCommand extends ClientCommandBase<ResultClientCommandPayload> {
  message: ClientMessage.RESULT,
  payload: ResultClientCommandPayload,
}
