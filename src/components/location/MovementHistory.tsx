import React from 'react';
import { useLocationStore } from '@/stores/locationStore';
import { useTargetStore } from '@/stores/targetStore';
import { format } from 'date-fns';
import './MovementHistory.css';

export const MovementHistory: React.FC = () => {
  const { getSelectedTarget } = useTargetStore();
  const { getMovementHistory } = useLocationStore();
  const selectedTarget = getSelectedTarget();
  const history = selectedTarget ? getMovementHistory(selectedTarget.id, 24) : [];
  
  const displayHistory = history.length > 0 ? history : [
    { address: 'Home — North Tehran Apt.', timestamp: new Date(Date.now() - 8 * 3600000), coordinates: { lat: 35.7912, lng: 51.4108 } },
    { address: 'Tehran Metro — Tajrish Station', timestamp: new Date(Date.now() - 6 * 3600000), coordinates: { lat: 35.8059, lng: 51.4307 } },
    { address: 'Reuters Bureau — Vanak', timestamp: new Date(Date.now() - 4 * 3600000), coordinates: { lat: 35.7642, lng: 51.4026 } },
    { address: 'Current Location', timestamp: new Date(), coordinates: { lat: 35.6892, lng: 51.3890 } },
  ];
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Movement History</div>
      </div>
      <div className="movement-history">
        {displayHistory.map((point, index) => (
          <div key={index} className="history-point">
            <div className={`history-marker ${index === displayHistory.length - 1 ? 'active' : ''}`}>
              <div className="marker-dot"></div>
              {index < displayHistory.length - 1 && <div className="marker-line"></div>}
            </div>
            <div className="history-details">
              <div className="history-address">{point.address}</div>
              <div className="history-time">{format(point.timestamp, 'HH:mm')}</div>
              <div className="history-coords">
                {point.coordinates.lat.toFixed(4)}°, {point.coordinates.lng.toFixed(4)}°
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};