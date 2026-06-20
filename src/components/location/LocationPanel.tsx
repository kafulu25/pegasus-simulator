import React, { useState } from 'react';
import { LiveMap } from './LiveMap';
import { MovementHistory } from './MovementHistory';
import { LocationTable } from './LocationTable';
import { ErrorBoundary } from '../../ErrorBoundary';
import './LocationPanel.css';

export const LocationPanel: React.FC = () => {
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [geofenceLat, setGeofenceLat] = useState('');
  const [geofenceLng, setGeofenceLng] = useState('');
  const [geofenceRadius, setGeofenceRadius] = useState('100');

  const handleSetGeofence = () => {
    // Use prompt-style modal for simplicity
    const lat = prompt('Enter latitude:');
    if (lat === null) return;
    const lng = prompt('Enter longitude:');
    if (lng === null) return;
    const radius = prompt('Enter radius in meters (default 100):') || '100';
    if (parseFloat(lat) && parseFloat(lng)) {
      alert(`Geofence set at (${lat}, ${lng}) with radius ${radius}m`);
      // In a real app, this would save to a store or backend.
    } else {
      alert('Invalid coordinates. Please enter numbers.');
    }
  };

  return (
    <div className="location-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📍</span> Location Tracking
          </div>
          <div className="panel-subtitle">GPS tracking & movement history</div>
        </div>
        <button className="btn-set-geofence" onClick={handleSetGeofence}>
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
  );
};
