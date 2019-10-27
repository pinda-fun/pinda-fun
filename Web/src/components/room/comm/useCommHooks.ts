import { useState, useEffect } from 'react';
import Comm, { Handlers, CommAttributes, noOpHandlers } from './Comm';
import Database from '../database/Database';
import { CommError } from './Errors';

export default function useCommHooks(comm: Comm): CommAttributes {
  const currentAttributes = comm.getAttributes();
  const [room, setRoom] = useState<string | null>(currentAttributes.room);
  const [error, setError] = useState<CommError | null>(currentAttributes.error);
  const [errorDescription, setErrorDescription] = useState<string | null>(
    currentAttributes.errorDescription,
  );
  const [database, setDatabase] = useState<Database | null>(
    currentAttributes.database,
  );

  const handlers: Handlers = {
    setRoom,
    setError,
    setErrorDescription,
    setDatabase,
  };
  useEffect(() => {
    comm.register(handlers);
    return () => comm.register(noOpHandlers);
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    room,
    error,
    errorDescription,
    database,
  };
}
