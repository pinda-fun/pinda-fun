import { useState, useEffect } from 'react';
import Comm, {
  Handlers, CommAttributes, noOpHandlers, ResultMap,
} from './Comm';
import { CommError } from './Errors';
import { HostMeta } from '../database/Meta';

const noOp = () => { };

/**
 * WARNING: Only one hook can be used at a time.
 */
export default function useCommHooks(
  comm: Comm,
  onGameStart: () => void = noOp,
  onGameEnd: () => void = noOp,
): CommAttributes {
  const currentAttributes = comm._getAttributes();
  const [room, setRoom] = useState<string | null>(currentAttributes.room);
  const [error, setError] = useState<CommError | null>(currentAttributes.error);
  const [errorDescription, setErrorDescription] = useState<string | null>(
    currentAttributes.errorDescription,
  );
  const [users, setUsers] = useState<string[]>(currentAttributes.users);
  const [hostMeta, setHostMeta] = useState<HostMeta | null>(
    currentAttributes.hostMeta,
  );
  const [results, setResults] = useState<ResultMap | null>(currentAttributes.results);
  const [isHost, setIsHost] = useState(currentAttributes.isHost);

  const handlers: Handlers = {
    setRoom,
    setError,
    setErrorDescription,
    setUsers,
    setHostMeta,
    setResults,
    setIsHost,
  };

  useEffect(() => {
    comm._register(handlers);
    comm._onGameStart(onGameStart);
    comm._onGameEnd(onGameEnd);

    return () => {
      comm._register(noOpHandlers);
      comm._onGameStart(noOp);
      comm._onGameEnd(noOp);
    };
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    room,
    error,
    errorDescription,
    users,
    hostMeta,
    results,
    isHost,
  };
}
