import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import NetlifyBadge from '../common/NetlifyBadge';

const NavBarContainer = styled.nav`
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const NavBar: React.FC = () => (
  <NavBarContainer>
    <NetlifyBadge />
    <Link to={{ pathname: '/join' }}>
      <Button primary>Join Game</Button>
    </Link>
  </NavBarContainer>
);

export default NavBar;
