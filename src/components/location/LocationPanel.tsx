import React from 'react';
import { LiveMap } from './LiveMap';
import { MovementHistory } from './MovementHistory';
import { LocationTable } from './LocationTable';
import { ErrorBoundary } from '../../ErrorBoundary';
import './LocationPanel.css';

const showToast = (type: string, title: string, message: string) => {
  alert(`${title}\n${message}`);
};

export const LocationPanel: React.FC = () => {
  console.log('📍 LocationPanel rendering');

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
