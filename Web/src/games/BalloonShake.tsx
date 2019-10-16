import React, { useState, useEffect } from 'react';
import {
  fromEvent, Observable, EMPTY,
} from 'rxjs';
import {
  filter, map, throttleTime, pluck,
} from 'rxjs/operators';
import useCounter from './hooks';

async function getShakeObservable(): Promise<Observable<number>> {
  if (!window.DeviceMotionEvent) {
    return new Observable(sub => sub.error('Your device does not support motion.'));
  }
  if (typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
    try {
      const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
      if (permissionResult !== 'granted') {
        return new Observable(sub => sub.error(permissionResult));
      }
    } catch (e) {
      return new Observable(sub => sub.error(e));
    }
  }
  return fromEvent(window, 'devicemotion').pipe(
    throttleTime(200),
    map(evt => (evt as DeviceMotionEvent).accelerationIncludingGravity),
    filter(x => x !== null),
    map(accel => accel!),
    pluck('y'),
    filter(x => x !== null),
    map(y => y!),
    filter(x => x > 5),
  );
}

export default function () {
  const [obs, setObs] = useState<Observable<number | never>>(EMPTY);
  const [permissionsSet, setPermissionsSet] = useState(false);
  const { count, status } = useCounter(obs);
  useEffect(() => {
    if (!permissionsSet) return;
    const getObs = async function getShakeObsAndSet() {
      setObs(await getShakeObservable());
    };
    getObs();
  }, [permissionsSet]);

  const getPermission = async function requestPermission() {
    const result = await (window.DeviceMotionEvent as any).requestPermission();
    if (result === 'granted') setPermissionsSet(true);
  };
  return (
    <>
      <p>
        Aylol:
        {' '}
        {count}
      </p>
      <p>
        Status:
        {' '}
        {status || 'no status updates'}
      </p>
      <button onClick={getPermission} type="button">
        PERMISSION
      </button>
    </>
  );
}
