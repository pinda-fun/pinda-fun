import { useState, useEffect } from 'react';
import Comm, { Handlers, CommAttributes, noOpHandlers } from './Comm';
import { CommError } from './Errors';
import { HostMeta } from '../database/Meta';

export default function useCommHooks(comm: Comm): CommAttributes {
  const currentAttributes = comm.getAttributes();
  const [room, setRoom] = useState<string | null>(currentAttributes.room);
  const [error, setError] = useState<CommError | null>(currentAttributes.error);
  const [errorDescription, setErrorDescription] = useState<string | null>(
    currentAttributes.errorDescription,
  );
  const [users, setUsers] = useState<string[]>(currentAttributes.users);
  const [hostMeta, setHostMeta] = useState<HostMeta | null>(
    currentAttributes.hostMeta,
  );

  const handlers: Handlers = {
    setRoom,
    setError,
    setErrorDescription,
    setUsers,
    setHostMeta,
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
    users,
    hostMeta,
  };
}
