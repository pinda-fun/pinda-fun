import React, { useState, useEffect } from 'react';
import {
  fromEvent, Observable, EMPTY,
} from 'rxjs';
import {
  filter, map, pluck, debounceTime, startWith,
} from 'rxjs/operators';
import useCounter from './hooks';
import { unwrap } from './utils/rxhelpers';
import Button from '../components/common/Button';

enum MotionPermission {
  NOT_SET = 0,
  DENIED = 1,
  GRANTED = 1
}

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
  const { count, status } = useCounter(obs, -1);

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

  useEffect(() => setObs(getShakeObservable(permission)), [permission]);

  const getPermission = async function requestPermission() {
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
      <p>
        Aylol: {count}
      </p>
      <p>
        Status: {status === null ? 'no status updates' : status}
      </p>
      {permission === MotionPermission.NOT_SET
        && (
          <p>
            Checking if you can play the game...
          </p>
        )}
      {showPermissionButton
        && (
          <Button onClick={getPermission} type="button">
            Set Permission
          </Button>
        )}
    </>
  );
};

export default BalloonShake;
