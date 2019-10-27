import GameState from '../comm/GameState';

interface MetaBase {
  isHost: boolean,
  name: string,
  result: number[] | null,
}

export interface HostMeta extends MetaBase {
  isHost: true,
  // HostMeta specific
  game: string,
  state: GameState,
}

export interface NonHostMeta extends MetaBase {
  isHost: false,
}

type Meta = HostMeta | NonHostMeta;
export default Meta;
