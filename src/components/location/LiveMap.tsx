import React from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useLocationStore } from '@/stores/locationStore';
import './LiveMap.css';

export const LiveMap: React.FC = () => {
  try {
    // Get targets and selected ID directly from store
    const targets = useTargetStore((state) => state.targets);
    const selectedTargetId = useTargetStore((state) => state.selectedTargetId);
    const getLatestLocation = useLocationStore((state) => state.getLatestLocation);

    const selectedTarget = targets.find(t => t.id === selectedTargetId) || targets[0] || null;
    const latestLocation = selectedTarget ? getLatestLocation(selectedTarget.id) : null;

    const targetName = selectedTarget?.name || 'Ahmad Karimi';
    const coords = latestLocation?.coordinates || { lat: 35.6892, lng: 51.3890 };
    const address = latestLocation?.address || 'Tehran, Iran';

    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Live Location — {targetName}
          </div>
          <div className="tag active">LIVE</div>
        </div>
        <div className="map-container">
          <div className="map-grid"></div>
          <div className="map-dot active"></div>
          <div className="map-coordinates">
            {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
          </div>
          <div className="map-address">{address}</div>
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
  } catch (error) {
    console.error('LiveMap error:', error);
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div>📍 Live Map</div>
        <div style={{ fontSize: '12px', marginTop: '8px' }}>Unable to load map data</div>
      </div>
    );
  }
};
