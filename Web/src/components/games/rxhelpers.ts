import { Observable, timer } from 'rxjs';
import {
  map, take,
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

export function createTimerObservable(ticks: number, timerInterval = 1000): Observable<number> {
  return timer(0, timerInterval).pipe(
    take(ticks + 1),
    map(x => ticks - x),
  );
}
