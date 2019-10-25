interface MetaBase {
  isHost: boolean,
  name: string,
  result: number[] | null,
  isFinished: boolean,
}

export enum GameState {
  PREPARE = 0,
  ONGOING = 1,
  FINISHED = 2,
}

export interface HostMeta extends MetaBase {
  isHost: true,
  // HostMeta specific
  game: string,
  gameState: GameState,
}

export interface NonHostMeta extends MetaBase {
  isHost: false,
}

type Meta = HostMeta | NonHostMeta;
export default Meta;
