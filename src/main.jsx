import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * App entry point. Not rendered in StrictMode, since double-invoking
 * effects would double-fire the config/menu fetches on mount.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);