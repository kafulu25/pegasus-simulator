import React from 'react';
import './LocationPanel.css';

// Mock location data – you can later replace with real data from targetStore
const mockLocations = [
  { label: 'Home — North Tehran Apt.', time: '04:14', coords: '35.7912°, 51.4108°' },
  { label: 'Tehran Metro — Tajrish Station', time: '06:14', coords: '35.8059°, 51.4307°' },
  { label: 'Reuters Bureau — Vanak', time: '08:14', coords: '35.7642°, 51.4026°' },
  { label: 'Current Location', time: '12:14', coords: '35.6892°, 51.3890°' },
];

const LocationPanel: React.FC = () => {
  return (
    <div className="location-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📍</span> Live Location — Ahmad Karimi
          </div>
          <div className="panel-subtitle">GPS tracking & movement history</div>
        </div>
        <span className="live-badge">LIVE</span>
      </div>
      <div className="scroll-content">
        <div className="location-list">
          {mockLocations.map((loc, index) => (
            <div key={index} className="location-item">
              <div className="location-label">{loc.label}</div>
              <div className="location-time">{loc.time}</div>
              <div className="location-coords">{loc.coords}</div>
              <div className="location-divider" />
            </div>
          ))}
        </div>
        <div className="location-footer">
          Tehran, Iran
        </div>
      </div>
    </div>
  );
};

export default LocationPanel;
