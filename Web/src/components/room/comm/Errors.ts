export enum CommError {
  NoMorePin = 'NoMorePin',
  // When the room is not accepting new players anymore
  RoomNotAccepting = 'RoomNotAccepting',
  Timeout = 'Timeout',
  HostLeft = 'HostLeft',
  Other = 'Other',
}

export enum PushError {
  NoChannel = 'NoChannel',
  Timeout = 'Timeout',
  Other = 'Other',
}
