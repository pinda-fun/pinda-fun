import React from 'react';
import styled from 'styled-components';
import DisplayText from 'components/common/DisplayText';

const Container = styled.div`
  background: var(--deep-purple);
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const GameCountdown: React.FC<{ secondsLeft: number }> = ({ secondsLeft }) => (
  <Container>
    <DisplayText>
      {secondsLeft - 1 > 0 ? secondsLeft - 1 : 'SHAKE!'}
    </DisplayText>
  </Container>
);

export default GameCountdown;
