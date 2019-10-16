import React, { useState, useEffect } from 'react';
import {
  fromEvent, Observable, EMPTY,
} from 'rxjs';
import {
  filter, map, pluck, debounceTime,
} from 'rxjs/operators';
import useCounter from './hooks';
import { unwrap } from './utils/rxhelpers';

enum MotionPermission {
  NOT_SET = 0,
  DENIED = 1,
  GRANTED = 1
}

/** Generates an observable of the shake event produced by the phone. */
function getShakeObservable(): Observable<number> {
  if (!window.DeviceMotionEvent) {
    return new Observable(sub => sub.error('Your device does not support motion.'));
  }
  return fromEvent(window, 'devicemotion').pipe(
    map(evt => (evt as DeviceMotionEvent).accelerationIncludingGravity),
    unwrap,
    pluck('y'),
    unwrap,
    filter(x => x > 10),
    debounceTime(100),
  );
}

const BalloonShake: React.FC = () => {
  const [obs, setObs] = useState<Observable<number | never>>(EMPTY);
  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const { count, status } = useCounter(obs);
  useEffect(() => {
    if (permission !== MotionPermission.GRANTED) return;
    setObs(getShakeObservable());
  }, [permission]);

  const getPermission = async function requestPermission() {
    if (typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
        if (permissionResult === 'granted') {
          setPermission(MotionPermission.GRANTED);
        }
        // TODO: Handle denied/failure case.
      } catch (e) {
        console.log(e);
      }
    } else {
      setPermission(MotionPermission.GRANTED);
    }
  };
  return (
    <>
      <p>
        Aylol: {count}
      </p>
      <p>
        Status: {status || 'no status updates'}
      </p>
      <button onClick={getPermission} type="button">
        PERMISSION
      </button>
    </>
  );
};

export default BalloonShake;
