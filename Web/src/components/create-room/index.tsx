import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import BigButton from 'components/common/BigButton';
import Loading from 'components/common/Loading';
import CommContext from 'components/room/comm/CommContext';
import useCommHooks from 'components/room/comm/useCommHooks';
import NumPlayers from './NumPlayers';
import SocialShare from './SocialShare';
import QrCode from './QrCode';
import { mdMin } from '../../utils/media';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';

const CreateRoomContainer = styled.div`
    background: var(--pale-yellow);
    min-height: 100vh;
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > * {
    margin: 0.5rem 0;
    }

    h2 {
    font-family: var(--primary-font);
    margin: 0.5rem 0;
    font-weight: normal;
    font-size: 1.3rem;
    }
`;

const Form = styled.form`
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
    border-bottom: 2px solid;
    width: 13rem;
    padding: 0 0 0.5rem 1rem;
    margin-bottom: 1.5rem;
`;

const CreateRoomButton = styled(BigButton)`
  padding-left: 2em;
  padding-right: 2em;
`;

const ErrorText = styled.p`
    color: red;
`;

interface Payload {
  name: string,
  game: string
}

interface LobbyReturnPayload {
  pin: string
}

function connectionIsSuccessful(returnPayloadValue: LobbyReturnPayload | {} | null):
  returnPayloadValue is LobbyReturnPayload {
  return (returnPayloadValue as LobbyReturnPayload).pin !== undefined;
}

const CreateRoomPage: React.FC = () => {
  const comm = useContext(CommContext);
  const { room, error, database } = useCommHooks(comm);

  const {
    channel, error: channelError, setChannel, returnPayload,
  } = useContext(ChannelContext) as
    UncontrolledErrorableChannelProps<Payload | {}, LobbyReturnPayload | {}>;

  const validated = (name: string, game: string) => {
    const trimmedName = name.trim();
    if (name.trim().length === 0)
      return {
        name: name,
        gameName: game,
        errors: ["Host name cannot be empty"],
      };
    return {
      name: trimmedName,
      gameName: game,
      errors: [],
    };
  }

  useEffect(() => {
    comm.createRoom('Julius', 'shake');
    return () => {
      comm.leaveRoom();
    };
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (database == null) return;
    database.onSync(() => {
      setNumPlayers(database.getNumPlayers());
      const metas = database.getMetas();
      setNames(Object.entries(metas).map(([clientId, meta]) => [clientId, meta.name]));
    });
  }, [database]);

  // TODO: stylise error
  if (error != null) {
    return <p>Error: {error.toString()}</p>;
  }

  if (room == null) {
    return <Loading />;
  }

  const sharableLink = `${window.location.origin}/join/${room}`;

  return (
    <CreateRoomContainer>
      <TwoColumnDiv>
        <div>
          <GamePinSection>
            <h2>Game PIN:</h2>
            <h1>{room}</h1>
          </GamePinSection>
          <NumPlayers numPlayers={numPlayers} hideOnMedium />
        </div>
        <ShareSection>
          <h2>Share via</h2>
          <ShareContent>
            <QrCode sharableLink={sharableLink} />
            <SocialShare sharableLink={sharableLink} />
          </ShareContent>
          <NumPlayers numPlayers={numPlayers} hideOnLarge />
        </ShareSection>
      </TwoColumnDiv>
      <Link to={{ pathname: '/room' }}>
        <StartButton>START!</StartButton>
      </Link>
      <Link to={{ pathname: '/' }}>Cancel</Link>
      <p>{room != null && `UserMetas: ${JSON.stringify(names)}`}</p>
      <PindaHappy />
      <Form
        onSubmit={e => {
          e.preventDefault();
          attemptCreation();
        }}
      >
        <StyledInput
          name="host-name"
          type="text"
          pattern="[a-zA-Z\s]*"
          value={hostName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHostName(event.target.value);
          }}
        />
        <CreateRoomButton
          type="submit"
          disabled={!hostName.length}
        >
          Make Room
                </CreateRoomButton>
        {inputErrors
          && (
            <ErrorText>
              {inputErrors}
            </ErrorText>
          )}
      </Form>
      <Link to={{ pathname: '/' }}>Cancel</Link>
    </CreateRoomContainer>
  );
};

export default CreateRoomPage;
