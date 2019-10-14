import React from 'react';
import { createGlobalStyle } from 'styled-components';
import logo from './logo.svg';
import './App.css';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Fredoka+One');
  @import url('https://fonts.googleapis.com/css?family=Luckiest+Guy');

  * {
    font-family: 'Fredoka One', sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Luckiest Guy', sans-serif;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </>
  );
};

export default App;
