import React, { useState, useEffect } from 'react';
import { Link, match } from 'react-router-dom';
import styled from 'styled-components';
import useErrorableChannel from 'components/room/hooks/useErrorableChannel';
import { getMetas } from 'components/room/Meta';
import BigButton from '../common/BigButton';
import { ReactComponent as PindaHeadSVG } from '../../svg/pinda-head-happy.svg';

const PIN_LENGTH = 4;

const JoinRoomContainer = styled.div`
  background: var(--pale-purple);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    font-family: var(--primary);
    font-size: 1.4rem;
    font-weight: normal;
  }
`;

const PindaHead = styled(PindaHeadSVG)`
  height: 5.5rem;
`;

const JoinRoomForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > * {
    margin: 10px 0;
  }
`;

const StyledInput = styled.input`
  font-size: 3rem;
  text-align: center;
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid;
  width: 13rem;
  letter-spacing: 1rem;
  padding: 0 0 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

const JoinRoomButton = styled(BigButton)`
  padding-left: 2em;
  padding-right: 2em;
`;

interface Payload {
  name: string,
}

type JoinRoomProps = {
  match: match<{ id?: string }>;
};

const JoinRoomPage: React.FC<JoinRoomProps> = ({
  match: { params: { id } },
}) => {
  const [gamePin, setGamePin] = useState(id ? id.substring(0, PIN_LENGTH) : '');
  const [name, setName] = useState('Caryn');

  const [names, setNames] = useState<[string, string][]>([]);

  const [gameName, setGameName] = useState<string | null>(null);

  const [numPlayers, setNumPlayers] = useState(0);

  const [channelName, setChannelName] = useState<string | null>(null);
  const { channel, error, presence } = useErrorableChannel(channelName, { name });

  const onJoinRoomFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Perform join room with gamePin
    if (gamePin.length !== PIN_LENGTH) return;
    const newName = prompt('What is your name?');
    if (newName == null || newName === '') {
      alert('Name cannot be empty');
      return;
    }
    setName(newName);
    setChannelName(`room:${gamePin}`);
  };

  useEffect(() => {
    if (presence == null) return;
    presence.onSync(() => {
      const metas = getMetas(presence);
      setNumPlayers(metas.length);
      setNames(metas.map(([clientId, meta]) => [clientId, meta.name]));
      if (gameName != null) return;
      const hostMeta = getMetas(presence).filter(([_, meta]) => meta.isHost);
      if (hostMeta.length !== 1) throw new Error('There should only be 1 host');
      const [_, { game }] = hostMeta[0];
      if (game == null) throw new Error("Why host don't have game :(");
      setGameName(game);
    });
  }, [presence]);

  return (
    <JoinRoomContainer>
      <PindaHead />
      <h1>Enter Game PIN</h1>
      <JoinRoomForm onSubmit={onJoinRoomFormSubmit}>
        <StyledInput
          name="gamepin"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          placeholder="XXXX"
          value={gamePin}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
            setGamePin(event.target.value.replace(/\D/g, ''))
          )}
          autoFocus
        />
        <JoinRoomButton type="submit" disabled={gamePin.length < PIN_LENGTH}>
          Let&apos;s Go!
        </JoinRoomButton>
        <Link to={{ pathname: '/' }}>Cancel</Link>
        <p>{channel != null && `Connected, numPlayers = ${numPlayers}`}</p>
        <p>{error != null && `Error: ${error[0].toString()} -- ${JSON.stringify(error[1])}`}</p>
        <p>{gameName != null && `Game: ${gameName}`}</p>
        <p>UserMetas: {JSON.stringify(names)}</p>
      </JoinRoomForm>
    </JoinRoomContainer>
  );
};

export default JoinRoomPage;
