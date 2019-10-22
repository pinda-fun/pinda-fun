import React, { useState, createContext, Context } from 'react';
import useErrorableChannel from './hooks/useErrorableChannel';
import { Channel } from 'phoenix';
import ErrorCause from './hooks/ErrorCause';

type ChannelConnectionArgs<T> = [string | null, T];

interface Payload {
  name: string,
}

interface ControlledErrorableChannelProps<T> {
  channel: Channel | null;
  error: [ErrorCause, any] | null;
  returnPayload: any;
  database: any;
  setArgs: React.Dispatch<React.SetStateAction<ChannelConnectionArgs<T>>>
};

const emptyChannelArgs: ChannelConnectionArgs<{}> = [null, {}];

export const useControlledErrorableChannel = function <T extends object>() {
  const [args, setArgs] = useState<ChannelConnectionArgs<T>>(
    emptyChannelArgs as ChannelConnectionArgs<T>
  );

  const {
    channel, error, returnPayload, database
  } = useErrorableChannel(...args);

  return {
    channel, error, returnPayload, database, setArgs
  }
};

const ChannelContext: Context<ControlledErrorableChannelProps<Payload>> = createContext(
  (undefined as unknown) as ControlledErrorableChannelProps<Payload>
);

export default ChannelContext;
