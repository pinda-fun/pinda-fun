import { useState, createContext, useMemo } from 'react';
import useErrorableChannel, { ErrorableChannel } from './hooks/useErrorableChannel';

interface Payload {
  name: string,
}

export interface UncontrolledErrorableChannelProps<T, U> extends ErrorableChannel<U> {
  setChannel: (newChannelId: string, channelPayload: T) => void;
}

const PAYLOAD_INIT = { name: '' };

export const useUncontrolledErrorableChannel = () => {
  const [channelPayload, setChannelPayload] = useState<Payload | {}>(PAYLOAD_INIT);
  const [channelId, setChannelId] = useState<string | null>(null);

  const {
    channel, error, returnPayload, database,
  } = useErrorableChannel(channelId, channelPayload);

  const setChannel = useMemo(() => (newChannelId: string, payload: Payload | {}) => {
    setChannelPayload(payload);
    setChannelId(newChannelId);
    // Payload is not a dependency because we only want to change channel on channelId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  return {
    channel, error, returnPayload, database, setChannel,
  };
};

const ChannelContext = createContext(
  (undefined as unknown) as UncontrolledErrorableChannelProps<Payload | {}, any>,
);

export default ChannelContext;
