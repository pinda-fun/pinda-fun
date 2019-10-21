interface MetaBase {
  isHost: boolean,
  name: string,
  game?: string,
}

export interface HostMeta extends MetaBase {
  isHost: true,
  game: string,
}

export interface NonHostMeta extends MetaBase {
  isHost: false,
}

type Meta = HostMeta | NonHostMeta;
export default Meta;
