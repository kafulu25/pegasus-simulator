import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './components/auth/LoginPage';
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={(username, password) => login(username)} />;
  }

  // If authenticated, show a simple message to prove the app renders
  return (
    <div style={{ 
      color: '#0f0', 
      fontSize: '30px', 
      padding: '40px',
      backgroundColor: '#000',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div>✅ You are logged in!</div>
      <div style={{ fontSize: '18px', marginTop: '20px' }}>
        The app is working. Now we can add components back one by one.
      </div>
    </div>
  );
}

export default App;
