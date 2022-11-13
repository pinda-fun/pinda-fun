import ReactDOM from 'react-dom';
import './index.css';
import smoothscroll from 'smoothscroll-polyfill';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Polyfills
smoothscroll.polyfill();
const polyfills = [];
if (!Object.fromEntries) polyfills.push(import('object.fromentries').then(fromEntries => fromEntries.shim()));

Promise.all(polyfills).then(() => ReactDOM.render(<App />, document.getElementById('root')));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
