import React, { useEffect, useRef } from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useLocationStore } from '@/stores/locationStore';
import './GlobalMap.css';

export const GlobalMap: React.FC = () => {
  const { targets } = useTargetStore();
  const { getLatestLocation } = useLocationStore();
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Mock map dots positions for different countries
  const getDotPosition = (country: string): { left: string; top: string } => {
    const positions: Record<string, { left: string; top: string }> = {
      'Iran': { left: '28%', top: '35%' },
      'Turkey': { left: '32%', top: '38%' },
      'UK': { left: '52%', top: '32%' },
      'Russia': { left: '48%', top: '28%' },
      'Mexico': { left: '25%', top: '55%' },
      'Japan': { left: '75%', top: '35%' },
      'Pakistan': { left: '45%', top: '42%' },
      'Venezuela': { left: '22%', top: '48%' },
    };
    return positions[country] || { left: '50%', top: '50%' };
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Global Map</div>
        <div className="flex gap-8 text-xs">
          <span className="text-green">● Active</span>
          <span className="text-red">● Alert</span>
          <span className="text-gold">● Idle</span>
        </div>
      </div>
      <div className="map-container" ref={mapRef}>
        <div className="map-grid"></div>
        {targets.map(target => {
          const position = getDotPosition(target.country);
          const statusColor = target.status === 'active' ? 'green' : target.status === 'idle' ? 'gold' : 'red';
          return (
            <div
              key={target.id}
              className={`map-dot ${statusColor}`}
              style={{ left: position.left, top: position.top }}
              title={`${target.name} - ${target.country}`}
            />
          );
        })}
        <div className="map-stats">
          {targets.length} targets across {new Set(targets.map(t => t.country)).size} regions
        </div>
      </div>
    </div>
  );
};