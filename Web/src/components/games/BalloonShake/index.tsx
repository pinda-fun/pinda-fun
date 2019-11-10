import React, { useState, useEffect, useContext } from 'react';
import {
  fromEvent, Observable, EMPTY,
} from 'rxjs';
import {
  filter, map, pluck, debounceTime, startWith, takeUntil, share, last,
} from 'rxjs/operators';
import CommContext from 'components/room/comm/CommContext';
import useCounter from '../hooks';
import { unwrap, createTimerObservable } from '../rxhelpers';
import { GameState, MotionPermission } from '../GameStates';
import GameDisplay from './GameDisplay';
import Countdown from '../Countdown';
import TimesUp from '../TimesUp';

const GAME_TIME = 20; // Total shake time given
const COUNTDOWN_TIME = 3; // Total time to countdown

/** Generates an observable of the shake event produced by the phone. */
function getShakeObservable(permission: MotionPermission): Observable<number> {
  if (permission !== MotionPermission.GRANTED) {
    return new Observable((sub) => sub.error('Your device does not support motion.'));
  }
  return fromEvent(window, 'devicemotion').pipe(
    map((evt) => (evt as DeviceMotionEvent).acceleration),
    unwrap,
    pluck('y'),
    unwrap,
    filter((x) => x > 10),
    debounceTime(100),
    startWith(0),
  );
}

/**
   BalloonShake uses an underlying state machine to manage the different stages in
   the game. There are the following stages:
   GameState:
     WAITING_START -> INSTRUCTIONS -> IN_PROGRESS -> COMPLETED
   MotionPermission:
     NOT_SET -> GRANTED
             |-> DENIED
 */
const BalloonShake: React.FC = () => {
  const [obs, setObs] = useState<Observable<number | never>>(EMPTY);
  const [permission, setPermission] = useState(MotionPermission.GRANTED);
  const [secondsLeft, setSecondsLeft] = useState(GAME_TIME);
  const [gameState, setGameState] = useState(GameState.COUNTING_DOWN);
  const { count } = useCounter(obs, -1);

  const comm = useContext(CommContext);

  const sendGameResults = () => {
    comm.sendResult([count]);
    setGameState(GameState.COMPLETED);
  };

  const getPermissionAvailability = () => {
    if (!window.DeviceMotionEvent) {
      setPermission(MotionPermission.DENIED);
      return;
    }
    setPermission(MotionPermission.GRANTED);
  };

  /** Game initialisation effect. */
  useEffect(getPermissionAvailability, []);

  /** IN_PROGRESS state handler. */
  useEffect(
    () => {
      if (permission !== MotionPermission.GRANTED
        || gameState !== GameState.IN_PROGRESS) return undefined;
      const timer = createTimerObservable(GAME_TIME).pipe(share());
      const timerSub = timer.subscribe(
        (left) => setSecondsLeft(left),
        null,
        () => setGameState(GameState.TIMES_UP),
      );
      setObs(getShakeObservable(permission).pipe(
        takeUntil(timer.pipe(last())),
      ));
      return () => timerSub.unsubscribe();
    },
    [permission, gameState],
  );

  return (
    <>
      {gameState === GameState.COUNTING_DOWN
        && (
          <Countdown
            seconds={COUNTDOWN_TIME}
            onComplete={() => setGameState(GameState.IN_PROGRESS)}
          />
        )}
      {gameState === GameState.IN_PROGRESS
        && <GameDisplay secondsLeft={secondsLeft} count={count} />}
      {gameState === GameState.TIMES_UP
        && (
          <TimesUp
            onComplete={sendGameResults}
          />
        )}
      {gameState === GameState.COMPLETED && (
        <TimesUp onComplete={() => { }} />
      )}
    </>
  );
};

export default BalloonShake;
