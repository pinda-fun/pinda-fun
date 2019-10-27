import { useState, useEffect } from 'react';
import Comm, { CommAttributes } from './Comm';

const noOp = () => { };

/**
 * WARNING: Only one hook can be used at a time.
 */
export default function useCommHooks(
  comm: Comm,
  onGameStart: () => void = noOp,
  onGameEnd: () => void = noOp,
): CommAttributes {
  const [attributes, setAttributes] = useState(comm._getAttributes());

  useEffect(() => {
    comm._register(setAttributes);
    comm._onGameStart(onGameStart);
    comm._onGameEnd(onGameEnd);

    return () => {
      comm._register(noOp);
      comm._onGameStart(noOp);
      comm._onGameEnd(noOp);
    };
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return attributes;
}
