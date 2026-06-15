import React, { useState } from 'react';
import { useKeylogStore } from '@/stores/keylogStore';
import './KeyloggerPanel.css';

export const KeyloggerPanel: React.FC = () => {
  const { entries } = useKeylogStore();
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  
  const targets = ['all', ...new Set(entries.map(e => e.targetName))];
  const filteredEntries = selectedTarget === 'all' 
    ? entries 
    : entries.filter(e => e.targetName === selectedTarget);
  
  return (
    <div className="keylogger-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">⌨️</span> Keylogger
          </div>
          <div className="panel-subtitle">Captured keystrokes per application</div>
        </div>
        <div className="target-filter">
          <select 
            className="filter-select"
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
          >
            {targets.map(target => (
              <option key={target} value={target}>
                {target === 'all' ? 'All Targets' : target}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="scroll-content">
        <div className="keylog-stats">
          <div className="stat-card">
            <div className="stat-label">Total Keystrokes</div>
            <div className="stat-value">{entries.reduce((sum, e) => sum + e.text.length, 0).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Applications</div>
            <div className="stat-value">{new Set(entries.map(e => e.app)).size}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Passwords Found</div>
            <div className="stat-value">{entries.filter(e => e.containsPassword).length}</div>
          </div>
        </div>
        
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="keylog-entry">
            <div className="keylog-header">
              <div className="keylog-app">{entry.app}</div>
              <div className="keylog-target">{entry.targetName}</div>
              <div className="keylog-time">
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="keylog-content">
              <div className="keylog-text">{entry.text}</div>
              {entry.containsPassword && (
                <div className="password-warning">⚠️ Contains password!</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};