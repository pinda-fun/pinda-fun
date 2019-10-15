import React, { useState, useRef, useEffect } from 'react';
import useCounter from './hooks';
import { fromEvent, Observable, EMPTY } from 'rxjs';
import { filter, map, throttleTime } from 'rxjs/operators';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';

function exceedsMagnitude(limit: number): (acc: DeviceMotionEventAcceleration | null) => boolean {
  return (acc: DeviceMotionEventAcceleration | null) => {
    return (acc !== null) && (acc.z !== null) && Math.abs(acc.z) > limit;
  }
}

async function getShakeObservable(): Promise<Observable<DeviceMotionEventAcceleration>> {
  if (!window.DeviceMotionEvent) {
    return new Observable(sub => sub.error("Your device does not support motion."));
  }
  if (typeof (window.DeviceMotionEvent as any).requestPermission == 'function') {
    const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
    if (permissionResult !== 'granted') {
      return new Observable(sub => sub.error(permissionResult));
    }
  }
  return fromEvent(window, 'devicemotion').pipe(
    map(evt => (evt as DeviceMotionEvent).accelerationIncludingGravity),
    filter(x => x !== null),
    map(accel => accel!)
  );
}

function getClickObservable(element: FromEventTarget<MouseEvent>): Observable<MouseEvent> {
  return fromEvent(element, 'click').pipe(
    throttleTime(300)
  );
}

export default function () {
  const [obs, setObs] = useState<Observable<DeviceMotionEventAcceleration | never>>(EMPTY);
  const { count, status } = useCounter(obs);
  useEffect(() => {
    const getObs = async function getShakeObsAndSet() {
      setObs(await getShakeObservable());
    };
    getObs();
  }, []);
  return (
    <>
      <p>
        Clicked: {count}
      </p>
      <p>
        Status: {status || "no status updates"}
      </p>
    </>
  );
};
