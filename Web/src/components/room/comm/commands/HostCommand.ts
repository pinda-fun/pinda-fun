import { GameState } from 'components/games/GameStates';

export enum HostMessage {
  STATE = 'state',
}

export interface HostCommandPayload { }

export interface HostCommandBase<T extends HostCommandPayload> {
  message: HostMessage,
  payload: T,
}

type HostCommand = StateHostCommand;

export default HostCommand;

/* StateHostCommand */
export interface StateHostCommandPayload extends HostCommandPayload {
  newState: GameState,
}

export interface StateHostCommand extends HostCommandBase<StateHostCommandPayload> {
  message: HostMessage.STATE,
  payload: StateHostCommandPayload
}
