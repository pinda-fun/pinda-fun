import React from 'react';
import { Link } from 'react-router-dom';
import BigButton from '../common/BigButton';

const StartNewGameButton: React.FC = () => (
  <Link to={{ pathname: '/room' }}>
    <BigButton>Start New Game</BigButton>
  </Link>
);

export default StartNewGameButton;
