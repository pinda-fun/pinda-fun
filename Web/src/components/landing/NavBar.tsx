import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const NavBarContainer = styled.nav`
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
`;

const NavBar: React.FC = () => (
  <NavBarContainer>
    <Link to={{ pathname: '/join' }}>
      <Button primary>Join Game</Button>
    </Link>
  </NavBarContainer>
);

export default NavBar;
