import { Presence } from 'phoenix';


export interface HostMeta extends Meta {
  isHost: true,
  game: string,
}

export interface NonHostMeta extends Meta {
  isHost: false,
}

export interface Meta {
  isHost: boolean,
  name: string,
  game?: string,
}

/**
 * Returns tuples of client id and Meta
 */
export function getMetas(presence: Presence): [string, Meta][] {
  return presence.list((id, { metas }) => [id, metas[0]]);
}

export function findHostMeta(metas: [string, Meta][]): [string, HostMeta] | null {
  const maybeHostMeta = metas.find(([_, meta]) => meta.isHost);
  if (maybeHostMeta == null) return null;
  return maybeHostMeta as [string, HostMeta];
}
