import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

const App: React.FC = () => (
  <Router>
    <Routes />
  </Router>
);

export default App;
