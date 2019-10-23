import { useState, useEffect } from 'react';
import Comm, {
  Handlers, CommAttributes, CommError, noOpHandlers,
} from '../Comm';
import Database from '../Database';

export default function useCommHooks(comm: Comm): CommAttributes {
  const [room, setRoom] = useState<string | null>(null);
  const [error, setError] = useState<CommError | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  const handlers: Handlers = {
    setRoom, setError, setErrorDescription, setDatabase,
  };
  useEffect(() => {
    comm.register(handlers);
    return () => comm.register(noOpHandlers);
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    room, error, errorDescription, database,
  };
}
