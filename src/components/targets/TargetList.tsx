import React, { useState } from 'react';
import { useTargetStore } from '@/stores/targetStore';
import './TargetList.css';

export const TargetList: React.FC = () => {
  const { targets, selectedTargetId, selectTarget } = useTargetStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTargets = targets.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="target-list-container">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search targets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="target-list">
        {filteredTargets.map((target) => (
          <div
            key={target.id}
            className={`target-item ${selectedTargetId === target.id ? 'selected' : ''}`}
            onClick={() => selectTarget(target.id)}
          >
            <div className="target-avatar" style={{ background: target.color }}>
              {target.avatar}
            </div>
            <div className="target-info">
              <div className="target-name">{target.name}</div>
              <div className="target-role">{target.role}</div>
            </div>
            <div className="target-meta">
              <div className={`tag ${target.os === 'iOS' ? 'ios' : 'android'}`}>
                {target.os}
              </div>
              <div className={`tag ${target.status}`}>
                {target.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};