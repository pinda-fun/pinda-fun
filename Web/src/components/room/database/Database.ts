import Meta, { HostMeta } from './Meta';

export default interface Database {
  hostId: string | null;

  getNumPlayers(): number
  getMetas(): { [clientId: string]: Meta }
  getHostMeta(): HostMeta | null
  getMyMeta(): Meta | null
  onSync(callback: () => void): void
}
