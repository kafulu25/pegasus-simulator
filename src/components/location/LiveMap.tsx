import React from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useLocationStore } from '@/stores/locationStore';
import './LiveMap.css';

export const LiveMap: React.FC = () => {
  const { getSelectedTarget } = useTargetStore();
  const { getLatestLocation } = useLocationStore();
  const selectedTarget = getSelectedTarget();
  const latestLocation = selectedTarget ? getLatestLocation(selectedTarget.id) : null;
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          Live Location — {selectedTarget?.name || 'Ahmad Karimi'}
        </div>
        <div className="tag active">LIVE</div>
      </div>
      <div className="map-container">
        <div className="map-grid"></div>
        <div className="map-dot active"></div>
        <div className="map-coordinates">
          {latestLocation?.coordinates.lat.toFixed(4)}° N, {latestLocation?.coordinates.lng.toFixed(4)}° E
        </div>
        <div className="map-address">{latestLocation?.address || 'Tehran, Iran'}</div>
      </div>
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-label">Speed:</span>
          <span className="stat-value-sm accent">12 km/h</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value-sm green">±3m</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Updated:</span>
          <span className="stat-value-sm">2s ago</span>
        </div>
      </div>
    </div>
  );
};