import { useState, useEffect, useContext } from 'react';
import { Handlers, CommAttributes, CommError } from '../Comm';
import Database from '../Database';
import CommContext from '../CommContext';

export default function useCommHooks(): CommAttributes {
  const comm = useContext(CommContext);
  const [room, setRoom] = useState<string | null>(null);
  const [error, setError] = useState<CommError | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  const handlers: Handlers = {
    setRoom, setError, setErrorDescription, setDatabase,
  };
  useEffect(() => {
    comm.register(handlers);
    return () => comm.register({});
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    room, error, errorDescription, database,
  };
}
