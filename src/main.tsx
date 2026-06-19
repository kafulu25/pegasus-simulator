import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create error boundary inline to catch any rendering issues
try {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ React mounted successfully');
} catch (error) {
  console.error('❌ Failed to mount React app:', error);
  document.body.innerHTML = `
    <div style="color:red;padding:20px;font-family:monospace;white-space:pre-wrap;">
      <h1>React Mount Error</h1>
      <p>${error}</p>
    </div>
  `;
}
