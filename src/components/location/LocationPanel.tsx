import React from 'react';
import { LocationTable } from './LocationTable';
import { ErrorBoundary } from '../../ErrorBoundary';
import './LocationPanel.css';

// Placeholder components (replace with real ones when ready)
const LiveMap: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#161b22', borderRadius: '8px', border: '1px solid #30363d', height: '300px' }}>
      <div style={{ color: '#8b949e', marginBottom: '8px' }}>📍 Live Map</div>
      <div style={{ height: 'calc(100% - 30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#30363d' }}>
        Map will appear here once the library is installed.
      </div>
    </div>
  );
};

const MovementHistory: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#161b22', borderRadius: '8px', border: '1px solid #30363d', height: '300px' }}>
      <div style={{ color: '#8b949e', marginBottom: '8px' }}>🔄 Movement History</div>
      <div style={{ height: 'calc(100% - 30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#30363d' }}>
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
