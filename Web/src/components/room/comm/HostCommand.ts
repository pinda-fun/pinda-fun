import { GameState } from 'components/games/GameStates';

export enum HostMessage {
  GAME_STATE = 'gameState',
}

export interface HostCommandPayload { }

export interface HostCommandBase<T extends HostCommandPayload> {
  message: HostMessage,
  payload: T,
}

type HostCommand = UpdateGameStateHostCommand;

export default HostCommand;

/* StartHostCommand */
export interface GameStateHostCommandPayload extends HostCommandPayload {
  newGameState: GameState,
}

export interface UpdateGameStateHostCommand extends HostCommandBase<GameStateHostCommandPayload> {
  message: HostMessage.GAME_STATE,
  payload: GameStateHostCommandPayload,
}
