import React, { useState } from 'react';
import { usePasswordStore } from '@/stores/passwordStore';
import './PasswordsPanel.css';

export const PasswordsPanel: React.FC = () => {
  const { credentials } = usePasswordStore();
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  
  const toggleShowPassword = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return '#00e676';
      case 'medium': return '#ff9800';
      default: return '#ff4d4d';
    }
  };
  
  return (
    <div className="passwords-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🔑</span> Extracted Credentials
          </div>
          <div className="panel-subtitle">Passwords, tokens, and authentication data</div>
        </div>
        <div className="cred-stats">
          <span className="stat-badge">Total: {credentials.length}</span>
          <span className="stat-badge">Weak: {credentials.filter(c => c.strength === 'weak').length}</span>
        </div>
      </div>
      <div className="scroll-content">
        <table className="credentials-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Service / App</th>
              <th>Username</th>
              <th>Password</th>
              <th>Strength</th>
              <th>Captured</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((cred) => (
              <tr key={cred.id}>
                <td className="target-cell">{cred.targetName}</td>
                <td className="service-cell">{cred.service}</td>
                <td className="username-cell">{cred.username}</td>
                <td className="password-cell">
                  <div className="password-wrapper">
                    <span className="password-text">
                      {showPasswords[cred.id] ? cred.password : '•'.repeat(12)}
                    </span>
                    <button
                      className="toggle-password"
                      onClick={() => toggleShowPassword(cred.id)}
                    >
                      {showPasswords[cred.id] ? '🙈' : '👁️'}
                    </button>
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(cred.password)}>
                      📋
                    </button>
                  </div>
                </td>
                <td>
                  <div 
                    className="strength-indicator"
                    style={{ background: getStrengthColor(cred.strength) }}
                  >
                    {cred.strength}
                  </div>
                </td>
                <td className="date-cell">{new Date(cred.capturedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};