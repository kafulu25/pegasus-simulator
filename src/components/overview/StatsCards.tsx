import React from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useFeedStore } from '@/stores/feedStore';
import { useAlertStore } from '@/stores/alertStore';
import './StatsCards.css';

export const StatsCards: React.FC = () => {
  const { targets } = useTargetStore();
  const { events } = useFeedStore();
  const { alerts } = useAlertStore();
  
  const activeTargets = targets.filter(t => t.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.dismissed).length;
  const liveSessions = events.filter(e => e.type === 'microphone' || e.type === 'camera').length;
  
  return (
    <div className="grid-4">
      <div className="card">
        <div className="card-title">Active Targets</div>
        <div className="stat-value green">{targets.length}</div>
        <div className="stat-label">Devices monitored</div>
        <div className="stat-change up">↑ {activeTargets} active now</div>
      </div>
      <div className="card">
        <div className="card-title">Data Collected</div>
        <div className="stat-value accent">2.4 TB</div>
        <div className="stat-label">Total extracted</div>
        <div className="stat-change up">↑ 180 GB today</div>
      </div>
      <div className="card">
        <div className="card-title">Live Sessions</div>
        <div className="stat-value red">{liveSessions}</div>
        <div className="stat-label">Active now</div>
        <div className="stat-change up">↑ Microphone x{Math.max(1, liveSessions)}</div>
      </div>
      <div className="card">
        <div className="card-title">Alerts</div>
        <div className="stat-value gold">{criticalAlerts}</div>
        <div className="stat-label">Require attention</div>
        <div className="stat-change down">↓ {criticalAlerts} critical</div>
      </div>
    </div>
  );
};