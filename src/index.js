import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Prevent zoom on double-tap for iOS
document.addEventListener('touchend', (e) => {
  if (e.timeStamp - (window._lastTap || 0) < 300) {
    e.preventDefault();
  }
  window._lastTap = e.timeStamp;
}, { passive: false });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
