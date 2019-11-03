import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GAListener from 'components/common/GAListener';
import Routes from './Routes';

const App: React.FC = () => (
  <Router>
    <GAListener>
      <Routes />
    </GAListener>
  </Router>
);

export default App;
