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
import GameDisplay from './GameDisplay';
import GameResults from './GameResults';
import GamePrep from './GamePrep';

const GAME_TIME = 30; // Total shake time given

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

const BalloonShake: React.FC = () => {
  const [obs, setObs] = useState<Observable<number | never>>(EMPTY);
  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const [showPermissionButton, setPermissionButton] = useState(false);
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

  useEffect(getPermissionAvailability, []);

  useEffect(() => {
    if (permission !== MotionPermission.GRANTED
      || gameState !== GameState.IN_PROGRESS) return;
    const timer = createTimerObservable(GAME_TIME).pipe(share());
    timer.subscribe(
      left => setSecondsLeft(left),
      null,
      () => setGameState(GameState.WAITING_RESULTS)
    );
    setObs(getShakeObservable(permission).pipe(
      takeUntil(timer.pipe(last())),
    ));
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
        && <GamePrep
          permission={permission}
          showPermissionRequest={showPermissionButton}
          requestPermissionCallback={getUserPermission}
          startGame={() => setGameState(GameState.IN_PROGRESS)}
        />
      }
      {gameState === GameState.IN_PROGRESS
        && <GameDisplay secondsLeft={secondsLeft} count={count} />
      }
      {gameState === GameState.WAITING_RESULTS
        && <GameResults finalCount={count} />
      }
    </>
  );
};

export default BalloonShake;
