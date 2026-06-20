import React from 'react';
import { ErrorBoundary } from '../../ErrorBoundary';
import './LocationPanel.css';

// Import the real components – if they fail, we catch the error
let LiveMap: React.ComponentType<any> | null = null;
let MovementHistory: React.ComponentType<any> | null = null;
let LocationTable: React.ComponentType<any> | null = null;

try {
  // These imports will fail if the files are missing or have errors
  LiveMap = require('./LiveMap').LiveMap;
} catch (e) {
  console.warn('LiveMap not available:', e);
}

try {
  MovementHistory = require('./MovementHistory').MovementHistory;
} catch (e) {
  console.warn('MovementHistory not available:', e);
}

try {
  LocationTable = require('./LocationTable').LocationTable;
} catch (e) {
  console.warn('LocationTable not available:', e);
}

// Fallback components if real ones are missing
const FallbackMap: React.FC = () => (
  <div style={{
    padding: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  }}>
    <div style={{ fontSize: '14px', opacity: 0.7 }}>📍 Live Map</div>
    <div style={{ fontSize: '12px', marginTop: '8px' }}>Map data will appear here</div>
  </div>
);

const FallbackHistory: React.FC = () => (
  <div style={{
    padding: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  }}>
    <div style={{ fontSize: '14px', opacity: 0.7 }}>🔄 Movement History</div>
    <div style={{ fontSize: '12px', marginTop: '8px' }}>No movement data available</div>
  </div>
);

const FallbackTable: React.FC = () => (
  <div style={{
    padding: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-muted)',
  }}>
    <div style={{ fontSize: '14px', opacity: 0.7 }}>📋 Location History</div>
    <div style={{ fontSize: '12px', marginTop: '8px' }}>No location records found</div>
  </div>
);

const showToast = (type: string, title: string, message: string) => {
  alert(`${title}\n${message}`);
};

export const LocationPanel: React.FC = () => {
  // Use real components if available, otherwise fallback
  const MapComponent = LiveMap || FallbackMap;
  const HistoryComponent = MovementHistory || FallbackHistory;
  const TableComponent = LocationTable || FallbackTable;

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
              <MapComponent />
            </ErrorBoundary>
            <ErrorBoundary>
              <HistoryComponent />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <TableComponent />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};
