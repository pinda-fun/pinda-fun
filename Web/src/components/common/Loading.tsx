import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components/macro';
import { ReactComponent as PindaHeadSVG } from '../../svg/pinda-head-happy.svg';

const LoadingDiv = styled.div`
  background-color: var(--pale-purple);
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PindaHead = styled(PindaHeadSVG)`
  height: 5rem;
`;

const Loading: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <LoadingDiv>
    <PindaHead />
    <ReactLoading type="bubbles" color="var(--purple)" />
    {children}
  </LoadingDiv>
);

export default Loading;
