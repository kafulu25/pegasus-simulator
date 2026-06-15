import React, { useState } from 'react';
import './InfectionsPanel.css';

interface VectorCard {
  id: string;
  name: string;
  description: string;
  type: 'zero-click' | 'one-click' | 'network';
  platforms: string[];
  riskLevel: 'high' | 'medium' | 'low';
}

const vectors: VectorCard[] = [
  {
    id: 'zero-click',
    name: 'Zero-Click Exploit',
    description: 'Deploy via iMessage/HomeKit without any user interaction required.',
    type: 'zero-click',
    platforms: ['iOS 15.x - 16.6'],
    riskLevel: 'high',
  },
  {
    id: 'one-click',
    name: 'One-Click (Link)',
    description: 'Send crafted URL via SMS/WhatsApp. Triggers on tap.',
    type: 'one-click',
    platforms: ['iOS & Android'],
    riskLevel: 'medium',
  },
  {
    id: 'network',
    name: 'Network Injection',
    description: 'MITM via cellular or Wi-Fi. Requires proximity to target.',
    type: 'network',
    platforms: ['Requires Access Point'],
    riskLevel: 'low',
  },
];

const infectionLogs = [
  { target: 'Ahmad Karimi', vector: 'Zero-Click (iMessage)', date: '2024-01-15', os: 'iOS 16.2', status: 'Active', version: 'v4.2.1' },
  { target: 'Leila Nazari', vector: 'One-Click (WhatsApp)', date: '2024-01-22', os: 'Android 13', status: 'Active', version: 'v4.2.1' },
  { target: 'Marcus Webb', vector: 'Network Injection', date: '2023-12-10', os: 'iOS 17.0', status: 'Active', version: 'v4.1.8' },
];

export const InfectionsPanel: React.FC = () => {
  const [selectedVector, setSelectedVector] = useState<VectorCard | null>(null);
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ff4d4d';
      case 'medium': return '#ff9800';
      default: return '#00e676';
    }
  };
  
  return (
    <div className="infections-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">💉</span> Infection Vectors
          </div>
          <div className="panel-subtitle">Deploy Pegasus to target devices</div>
        </div>
      </div>
      <div className="scroll-content">
        <div className="vectors-grid">
          {vectors.map((vector) => (
            <div key={vector.id} className="vector-card" style={{ borderColor: getRiskColor(vector.riskLevel) }}>
              <div className="vector-header">
                <div className="vector-name">{vector.name}</div>
                <div className={`risk-badge ${vector.riskLevel}`}>{vector.riskLevel.toUpperCase()}</div>
              </div>
              <div className="vector-description">{vector.description}</div>
              <div className="vector-platforms">
                {vector.platforms.map((platform, i) => (
                  <span key={i} className="platform-tag">{platform}</span>
                ))}
              </div>
              <button className="deploy-btn" onClick={() => setSelectedVector(vector)}>
                Deploy →
              </button>
            </div>
          ))}
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Infection Log</div>
          </div>
          <table className="infection-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Vector</th>
                <th>Date</th>
                <th>OS</th>
                <th>Status</th>
                <th>Agent Ver.</th>
              </tr>
            </thead>
            <tbody>
              {infectionLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.target}</td>
                  <td>{log.vector}</td>
                  <td>{log.date}</td>
                  <td>{log.os}</td>
                  <td><span className="status-active">ACTIVE</span></td>
                  <td className="version-cell">{log.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedVector && (
        <div className="modal-overlay" onClick={() => setSelectedVector(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Deploy: {selectedVector.name}</div>
              <button className="modal-close" onClick={() => setSelectedVector(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label className="form-label">Select Target</label>
                <select className="form-select">
                  <option>Ahmad Karimi (iPhone 14 Pro)</option>
                  <option>Leila Nazari (Samsung S23)</option>
                  <option>Marcus Webb (iPhone 13)</option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-label">Target Identifier</label>
                <input className="form-input" placeholder="Phone number / iCloud email / IMSI" />
              </div>
              <div className="form-row">
                <label className="form-label">Payload Version</label>
                <select className="form-select">
                  <option>v4.2.2 (Latest)</option>
                  <option>v4.2.1</option>
                  <option>v4.1.8</option>
                </select>
              </div>
              <div className="warning-message">
                ⚠ Deployment is irreversible. Ensure authorization is confirmed before proceeding.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedVector(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => {
                alert('Deployment initiated!');
                setSelectedVector(null);
              }}>Confirm Deploy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};