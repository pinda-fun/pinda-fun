import Meta from './Meta';

export default interface PresenceState {
  [clientId: string]: { metas: Meta[] }
}
