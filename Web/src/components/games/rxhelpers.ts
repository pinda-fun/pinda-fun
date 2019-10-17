import { Observable, interval, defer } from 'rxjs';
import {
  takeWhile, map,
} from 'rxjs/operators';


/** Unwraps Optional (`T | null`) types to `T`, or filters out if `null`. */
export function unwrap<T>(observable: Observable<T | null>) {
  return new Observable<T>(newObserver => {
    const subscription = observable.subscribe(
      nextItem => {
        if (nextItem !== null) newObserver.next(nextItem);
      },
      newObserver.error,
      newObserver.complete,
    );
    return subscription.unsubscribe;
  });
}

function immediateTimerObservable(ticks: number, timerInterval = 1000): Observable<number> {
  const startTime = new Date().getTime();
  return interval(timerInterval).pipe(
    map(() => new Date().getTime() - startTime),
    takeWhile(x => x <= timerInterval * ticks),
    map(x => Math.max(0, ticks - Math.floor(x / timerInterval))),
  );
}

/**
   Defers creation of observable until subscribed to. Required for wall-clock relative
   timing in order support phone browser going inactive.
 */
export const createTimerObservable = (ticks: number, timerInterval?: number) => defer(
  () => immediateTimerObservable(ticks, timerInterval),
);
