import Game from 'components/room/Games';
import shuffle from 'lodash.shuffle';

export default class GameSequenceGenerator {
  private currentRoundGames: Game[];

  constructor() {
    this.currentRoundGames = [];
  }

  getNext(): Game {
    const maybeGame = this.currentRoundGames.pop();
    if (maybeGame !== undefined) return maybeGame;
    this.currentRoundGames = shuffle(Object.values(Game));
    return this.getNext();
  }
}
