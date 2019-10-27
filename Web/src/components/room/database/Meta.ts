interface MetaBase {
  isHost: boolean,
  name: string,
}

export interface HostMeta extends MetaBase {
  isHost: true,
  // HostMeta specific
  game: string,
  isStart: boolean,
}

export interface NonHostMeta extends MetaBase {
  isHost: false,
}

export function metaIsHost(meta: MetaBase): meta is HostMeta {
  return meta.isHost;
}

type Meta = HostMeta | NonHostMeta;
export default Meta;
