import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === 'admin' && password === 'pegasus2024') {
        onLogin(username, password);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', username);
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">🦅</div>
          <h1>PEGASUS</h1>
          <p>NSO Intelligence Platform</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>⚠️ Authorized Personnel Only</p>
          <p>Unauthorized access is prohibited</p>
        </div>
      </div>
      
      <div className="matrix-bg"></div>
    </div>
  );
};
