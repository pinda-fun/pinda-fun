import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import smoothscroll from 'smoothscroll-polyfill';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Polyfills

const fromEntries = require('object.fromentries');

smoothscroll.polyfill();
if (!Object.fromEntries) fromEntries.shim();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
