import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from 'components/common/Button';
import BigButton from 'components/common/BigButton';
import Modal from 'components/common/Modal';
import { MotionPermission } from 'components/games/BalloonShake/GameStates';
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

const ErrorText = styled.p`
  color: red;
`;

const JoinRoomPage: React.FC = () => {
  const [gamePin, setGamePin] = useState('');
  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const [showPermissionDialog, setPermissionDialog] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);

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

  const onJoinRoomFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (gamePin.length < PIN_LENGTH) return;
    setJoinRequested(true);
  };

  useEffect(() => {
    if (joinRequested && permission === MotionPermission.NOT_SET) {
      getPermissionAvailability();
    }
    if (joinRequested && permission === MotionPermission.GRANTED) {
      // Perform game join logic here.
    }
  }, [permission, joinRequested]);

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
        <JoinRoomButton
          type="submit"
          disabled={gamePin.length < PIN_LENGTH
            || permission === MotionPermission.DENIED}
        >
          Let&apos;s Go!
        </JoinRoomButton>
        {permission === MotionPermission.DENIED
          && (
            <ErrorText>
              Unable to get permissions to play Pinda.
            </ErrorText>
          )}
        <Link to={{ pathname: '/' }}>Cancel</Link>
      </JoinRoomForm>
      {showPermissionDialog
        && (
          <Modal>
            <h3>
              Give Permissions?
            </h3>
            <p>
              Pinda requires some device permissions in order to play some games.
            </p>
            <Button primary onClick={getUserPermission}>
              Sure!
            </Button>
          </Modal>
        )}
    </JoinRoomContainer>
  );
};

export default JoinRoomPage;
