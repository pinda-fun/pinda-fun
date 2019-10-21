import React, { useState, useEffect } from 'react';
import { match } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'components/common/Modal';
import { MotionPermission } from 'components/games/BalloonShake/GameStates';
import useErrorableChannel from 'components/room/hooks/useErrorableChannel';
import { ReactComponent as PindaHeadSVG } from '../../svg/pinda-head-happy.svg';
import JoinRoomForm from './JoinRoomForm';

const PIN_LENGTH = 4;

const JoinRoomContainer = styled.div`
  background: var(--pale-purple);
  min-height: 100vh;
  width: 100vw;
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

  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const [showPermissionDialog, setPermissionDialog] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);
  const [numPlayers, setNumPlayers] = useState(0);

  const [channelName, setChannelName] = useState<string | null>(null);
  const { channel, error, database } = useErrorableChannel(channelName, { name });

  const getUserPermission = async function requestPermission() {
    try {
      const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
      if (permissionResult === 'granted') {
        setPermission(MotionPermission.GRANTED);
      } else {
        setPermission(MotionPermission.DENIED);
      }
    } catch (e) {
      setPermission(MotionPermission.DENIED);
    } finally {
      setPermissionDialog(false);
    }
  };

  const getPermissionAvailability = () => {
    if (!window.DeviceMotionEvent) {
      setPermission(MotionPermission.DENIED);
      return;
    }
    if (typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
      setPermissionDialog(true);
    } else {
      setPermission(MotionPermission.GRANTED);
    }
  };

  const onJoinRoomFormSubmit = (newGamePin: string) => {
    if (joinRequested && newGamePin === gamePin) return;
    if (newGamePin.length !== PIN_LENGTH) return;

    // Reset state
    setChannelName(null);
    setGameName(null);
    setNames([]);

    setJoinRequested(true);

    setGamePin(newGamePin);
  };

  useEffect(() => {
    if (joinRequested && permission === MotionPermission.NOT_SET) {
      getPermissionAvailability();
    }
    if (joinRequested && permission === MotionPermission.GRANTED) {
      const newName = prompt('What is your name?');
      if (newName == null || newName === '') {
        alert('Name cannot be empty');
        setJoinRequested(false);
        return;
      }
      setName(newName);
      setChannelName(`room:${gamePin}`);
    }
  }, [permission, joinRequested, gamePin]);

  useEffect(() => {
    if (database == null) return;
    database.onSync(() => {
      setNumPlayers(database.getNumPlayers());
      const metas = database.getMetas();
      setNames(Object.entries(metas).map(([clientId, meta]) => [clientId, meta.name]));

      if (gameName != null) return;
      const maybeHostMeta = database.getHostMeta();
      if (maybeHostMeta == null) {
        // Handle the case when the host left
        setGameName('Unknown, host left us :(');
        return;
      }
      const { game } = maybeHostMeta;
      setGameName(game);
    });
  }, [database, gameName]);

  useEffect(() => {
    if (error != null) setJoinRequested(false);
  }, [error]);

  return (
    <JoinRoomContainer>
      <PindaHead />
      <JoinRoomForm
        submitJoinRoomForm={onJoinRoomFormSubmit}
        initialId={id}
        permission={permission}
      />
      <p>{channel != null && `Connected, numPlayers = ${numPlayers}`}</p>
      <p>{error != null && `Error: ${error[0].toString()} -- ${JSON.stringify(error[1])}`}</p>
      <p>{gameName != null && `Game: ${gameName}`}</p>
      <p>UserMetas: {JSON.stringify(names)}</p>
      <Modal
        isVisible={showPermissionDialog}
        title="Give Permissions?"
        onConfirm={getUserPermission}
        confirmationButtonText="Sure!"
      >
        Pinda requires some device permissions in order to play some games.
      </Modal>
    </JoinRoomContainer>
  );
};

export default JoinRoomPage;
