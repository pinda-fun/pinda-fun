import React, { useState, useEffect } from 'react';
import {
  fromEvent, Observable, EMPTY,
} from 'rxjs';
import {
  filter, map, pluck, debounceTime, startWith, takeUntil, share, last,
} from 'rxjs/operators';
import useCounter from '../hooks';
import { unwrap, createTimerObservable } from '../rxhelpers';
import { GameState, MotionPermission } from './GameStates';
import GameCountdown from './GameCountdown';
import GameDisplay from './GameDisplay';
import GameResults from './GameResults';
import GamePrep from './GamePrep';

const GAME_TIME = 20; // Total shake time given
const COUNTDOWN_TIME = 4; // Total time to countdown

/** Generates an observable of the shake event produced by the phone. */
function getShakeObservable(permission: MotionPermission): Observable<number> {
  if (permission !== MotionPermission.GRANTED) {
    return new Observable(sub => sub.error('Your device does not support motion.'));
  }
  return fromEvent(window, 'devicemotion').pipe(
    map(evt => (evt as DeviceMotionEvent).acceleration),
    unwrap,
    pluck('y'),
    unwrap,
    filter(x => x > 10),
    debounceTime(100),
    startWith(0),
  );
}

/**
   BalloonShake uses an underlying state machine to manage the different stages in
   the game. There are the following stages:
   GameState:
     WAITING_START -> COUNTING_DOWN -> IN_PROGRESS -> WAITING_RESULT -> RESULT
   MotionPermission:
     NOT_SET -> GRANTED
             |-> DENIED
 */
const BalloonShake: React.FC = () => {
  const [obs, setObs] = useState<Observable<number | never>>(EMPTY);
  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const [showPermissionButton, setPermissionButton] = useState(false);
  const [countdownLeft, setCountdownLeft] = useState(COUNTDOWN_TIME);
  const [secondsLeft, setSecondsLeft] = useState(GAME_TIME);
  const [gameState, setGameState] = useState(GameState.WAITING_START);
  const { count } = useCounter(obs, -1);

  const getPermissionAvailability = () => {
    if (!window.DeviceMotionEvent) {
      setPermission(MotionPermission.DENIED);
      return;
    }
    if (typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
      setPermissionButton(true);
    } else {
      setPermission(MotionPermission.GRANTED);
    }
  };

  /** Game initialisation effect. */
  useEffect(getPermissionAvailability, []);

  /** COUNTING_DOWN state handler. */
  useEffect(() => {
    if (permission !== MotionPermission.GRANTED
      || gameState !== GameState.COUNTING_DOWN) return undefined;
    const timer = createTimerObservable(COUNTDOWN_TIME);
    const timerSub = timer.subscribe(
      timeLeft => setCountdownLeft(timeLeft),
      null,
      () => setGameState(GameState.IN_PROGRESS),
    );
    return () => timerSub.unsubscribe();
  }, [permission, gameState]);

  /** IN_PROGRESS state handler. */
  useEffect(() => {
    if (permission !== MotionPermission.GRANTED
      || gameState !== GameState.IN_PROGRESS) return undefined;
    const timer = createTimerObservable(GAME_TIME).pipe(share());
    const timerSub = timer.subscribe(
      left => setSecondsLeft(left),
      null,
      () => setGameState(GameState.WAITING_RESULTS),
    );
    setObs(getShakeObservable(permission).pipe(
      takeUntil(timer.pipe(last())),
    ));
    return () => timerSub.unsubscribe();
  }, [permission, gameState]);

  const getUserPermission = async function requestPermission() {
    try {
      const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
      if (permissionResult === 'granted') {
        setPermission(MotionPermission.GRANTED);
      } else {
        setPermission(MotionPermission.DENIED);
      }
    } catch (e) {
      setPermission(MotionPermission.DENIED);
    } finally {
      setPermissionButton(false);
    }
  };

  return (
    <>
      {gameState === GameState.WAITING_START
        && (
          <GamePrep
            permission={permission}
            showPermissionRequest={showPermissionButton}
            requestPermissionCallback={getUserPermission}
            startGame={() => setGameState(GameState.COUNTING_DOWN)}
          />
        )}
      {gameState === GameState.COUNTING_DOWN
        && <GameCountdown secondsLeft={countdownLeft} />}
      {gameState === GameState.IN_PROGRESS
        && <GameDisplay secondsLeft={secondsLeft} count={count} />}
      {gameState === GameState.WAITING_RESULTS
        && <GameResults finalCount={count} />}
    </>
  );
};

export default BalloonShake;
