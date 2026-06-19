import React from 'react';
import { StatsCards } from './StatsCards';
import { GlobalMap } from './GlobalMap';
import { RecentActivityFeed } from './RecentActivityFeed';
import './OverviewPanel.css';

export const OverviewPanel: React.FC = () => {
  return (
    <div className="overview-panel">
      <div className="overview-top-row">
        <div className="panel-header">
          <div className="panel-title">
            <span className="icon">📊</span> Operations Overview
          </div>
          <div className="panel-subtitle">Real-time surveillance intelligence dashboard</div>
        </div>
        <div className="stats-cards-wrapper">
          <StatsCards />
        </div>
      </div>
      <div className="scroll-content">
        <div className="grid-2">
          <GlobalMap />
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
};
