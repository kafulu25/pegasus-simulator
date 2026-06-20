import React from 'react';
import { LocationTable } from './LocationTable';
import { ErrorBoundary } from '../../ErrorBoundary';
import './LocationPanel.css';

// Placeholder components styled to match the app's design
const LiveMap: React.FC = () => {
  return (
    <div className="card" style={{ 
      padding: '20px', 
      background: 'var(--bg-card)', 
      border: '1px solid var(--border)', 
      borderRadius: '8px', 
      height: '300px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
        📍 Live Map
      </div>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)',
        fontSize: '14px',
        opacity: 0.7
      }}>
        Map will appear here once the library is installed.
      </div>
    </div>
  );
};

const MovementHistory: React.FC = () => {
  return (
    <div className="card" style={{ 
      padding: '20px', 
      background: 'var(--bg-card)', 
      border: '1px solid var(--border)', 
      borderRadius: '8px', 
      height: '300px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
        🔄 Movement History
      </div>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)',
        fontSize: '14px',
        opacity: 0.7
      }}>
        Movement history will appear here.
      </div>
    </div>
  );
};

const showToast = (type: string, title: string, message: string) => {
  alert(`${title}\n${message}`);
};

export const LocationPanel: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="location-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span className="icon">📍</span> Location Tracking
            </div>
            <div className="panel-subtitle">GPS tracking & movement history</div>
          </div>
          <button className="btn-set-geofence" onClick={() => showToast('info', 'Geofence set', 'Alert will trigger when target leaves zone.')}>
            + Set Geofence
          </button>
        </div>
        <div className="scroll-content">
          <div className="grid-2">
            <ErrorBoundary>
              <LiveMap />
            </ErrorBoundary>
            <ErrorBoundary>
              <MovementHistory />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <LocationTable />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};
