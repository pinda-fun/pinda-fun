import { Presence, Channel } from 'phoenix';
import getClientId from 'utils/getClientId';
import Meta, { HostMeta } from '../Meta';
import Database from '../Database';

interface PresenceState {
  [clientId: string]: { metas: Meta[] }
}

export default class PhoenixDatabase implements Database {
  private presence: Presence<PresenceState>;

  hostId: string | null;

  private oldHostMeta: HostMeta | null;

  private onSyncHandler: (oldHostMeta: HostMeta | null) => void;

  constructor(channel: Channel) {
    this.presence = new Presence(channel);
    this.onSyncHandler = () => { };
    this.hostId = null;
    this.oldHostMeta = null;

    this.presence.onSync(() => {
      const { state } = this.presence;
      if (this.hostId == null) {
        const maybeHostId = Object.keys(state).find((clientId) => state[clientId].metas[0].isHost);
        this.hostId = maybeHostId == null ? null : maybeHostId;
      }
      this.onSyncHandler(this.oldHostMeta);
      this.oldHostMeta = this.getHostMeta();
    });
  }

  getNumPlayers(): number {
    return Object.keys(this.presence.state).length;
  }

  getMetas(): { [clientId: string]: Meta } {
    return Object.fromEntries(
      Object.entries(this.presence.state).map(([clientId, { metas }]) => [clientId, metas[0]]),
    );
  }

  getHostMeta(): HostMeta | null {
    const { state } = this.presence;
    const { hostId } = this;
    if (hostId == null || !(hostId in state)) return null;
    const maybeHostMeta = state[hostId].metas[0];
    if (!maybeHostMeta.isHost) return null;
    return maybeHostMeta;
  }

  getMyMeta(): Meta | null {
    const { state } = this.presence;
    const clientId = getClientId();
    if (!(clientId in state)) return null;
    return state[clientId].metas[0];
  }

  onSync(callback: (oldHostMeta: HostMeta | null) => void): void {
    this.onSyncHandler = callback;
  }
}
