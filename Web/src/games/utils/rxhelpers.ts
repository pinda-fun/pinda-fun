import { Observable } from 'rxjs';

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
