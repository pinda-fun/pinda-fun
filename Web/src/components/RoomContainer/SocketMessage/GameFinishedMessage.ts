import SocketMessage, { EventType } from '.';

export default class GameFinishedMessage extends SocketMessage {
  type: EventType = EventType.GameFinished;

  payload: number[];

  constructor(results: number[]) {
    super();
    this.type = EventType.GameFinished;
    this.payload = results;
  }
}
