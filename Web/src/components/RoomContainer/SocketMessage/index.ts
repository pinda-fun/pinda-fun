export enum EventType {
  GameFinished = 'gameFinishedEvent'
}

abstract class SocketMessage {
  abstract type: EventType;

  abstract payload: object;
}

export default SocketMessage;
