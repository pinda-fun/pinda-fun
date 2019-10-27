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

export function metaIsHost(meta: MetaBase): meta is HostMeta {
  return meta.isHost;
}

type Meta = HostMeta | NonHostMeta;
export default Meta;
