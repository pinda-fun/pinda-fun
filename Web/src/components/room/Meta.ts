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

type Meta = HostMeta | NonHostMeta;
export default Meta;
