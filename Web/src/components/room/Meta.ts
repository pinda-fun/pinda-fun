import { Presence } from 'phoenix';

export interface Meta {
  game?: string,
  isHost: boolean,
  name: string,
}

/**
 * Returns tuples of client id and Meta
 */
export function getMetas(presence: Presence): [string, Meta][] {
  return presence.list((id, { metas }) => [id, metas[0]]);
}
