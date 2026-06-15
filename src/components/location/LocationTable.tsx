import React from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useLocationStore } from '@/stores/locationStore';
import { formatDistanceToNow } from 'date-fns';
import './LocationTable.css';

export const LocationTable: React.FC = () => {
  const { targets } = useTargetStore();
  const { getLatestLocation } = useLocationStore();
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">All Targets — Location Overview</div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Last Known Location</th>
              <th>Coordinates</th>
              <th>Updated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {targets.map(target => {
              const location = getLatestLocation(target.id);
              return (
                <tr key={target.id}>
                  <td className="target-name-cell">{target.name}</td>
                  <td>{location?.address || target.country}</td>
                  <td className="coordinates">
                    {location 
                      ? `${location.coordinates.lat.toFixed(4)}°, ${location.coordinates.lng.toFixed(4)}°`
                      : '—'}
                  </td>
                  <td className="updated-time">
                    {location 
                      ? formatDistanceToNow(location.timestamp, { addSuffix: true })
                      : 'Unknown'}
                  </td>
                  <td>
                    <div className={`status-badge-sm ${target.status}`}>
                      {target.status.toUpperCase()}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};