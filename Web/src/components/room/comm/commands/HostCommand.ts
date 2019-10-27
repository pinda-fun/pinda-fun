import Game from 'components/room/Games';
import GameState from '../GameState';

export enum HostMessage {
  STATE = 'state',
  GAME = 'game',
}

export interface HostCommandPayload { }

export interface HostCommandBase<T extends HostCommandPayload> {
  message: HostMessage,
  payload: T,
}

type HostCommand = StateHostCommand | GameHostCommand;

export default HostCommand;

/* StateHostCommand */
export interface StateHostCommandPayload extends HostCommandPayload {
  state: GameState,
}

export interface StateHostCommand extends HostCommandBase<StateHostCommandPayload> {
  message: HostMessage.STATE,
  payload: StateHostCommandPayload
}

/* GameHostCommand */
export interface GameHostCommandPayload extends HostCommandPayload {
  game: Game
}

export interface GameHostCommand extends HostCommandBase<GameHostCommandPayload> {
  message: HostMessage.GAME,
  payload: GameHostCommandPayload,
}
