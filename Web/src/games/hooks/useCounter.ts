import React, { useState } from 'react';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

interface CounterWithStatus<T> {
  count: number;
  status: T;
}

export default function useCounter<T>(observable: Observable<T>): CounterWithStatus<T | null> {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<T | null>(null);

  React.useEffect(() => {
    const sub = observable.pipe(
      scan(
        (acc, cur) => ({
          count: acc.count + 1,
          status: cur,
        }),
        {
          count: 0,
          status: null as T | null,
        })
    ).subscribe(
      x => {
        setCount(x.count);
        setStatus(x.status);
      },
      x => {
        setStatus(x);
      }
    );
    return () => sub.unsubscribe();
  }, [observable]);
  return { count, status };
}
