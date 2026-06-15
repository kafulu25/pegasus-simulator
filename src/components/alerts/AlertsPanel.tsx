import React from 'react';
import { useAlertStore } from '@/stores/alertStore';
import './AlertsPanel.css';

// Add this function inside the component
const showToast = (type: string, title: string, message: string) => {
  console.log(`${title}: ${message}`);
  alert(`${title}\n${message}`);
};

export const AlertsPanel: React.FC = () => {
  const { alerts, dismissAlert, acknowledgeAlert } = useAlertStore();
  const activeAlerts = alerts.filter(a => !a.dismissed);
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      default: return '🔵';
    }
  };
  
  return (
    <div className="alerts-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🔔</span> Alerts & Triggers
          </div>
          <div className="panel-subtitle">Automated surveillance alerts</div>
        </div>
        <button className="btn-new-alert" onClick={() => showToast('info', 'Alert created', 'New keyword trigger added.')}>
  + New Alert
</button>
      </div>
      <div className="scroll-content">
        <div className="alerts-stats">
          <div className="alert-stat critical">
            <div className="alert-stat-value">{alerts.filter(a => a.type === 'critical' && !a.dismissed).length}</div>
            <div className="alert-stat-label">Critical</div>
          </div>
          <div className="alert-stat warning">
            <div className="alert-stat-value">{alerts.filter(a => a.type === 'warning' && !a.dismissed).length}</div>
            <div className="alert-stat-label">Warning</div>
          </div>
          <div className="alert-stat info">
            <div className="alert-stat-value">{alerts.filter(a => a.type === 'info' && !a.dismissed).length}</div>
            <div className="alert-stat-label">Info</div>
          </div>
        </div>
        
        {activeAlerts.map((alert) => (
          <div key={alert.id} className={`alert-card ${alert.type}`}>
            <div className="alert-icon">{getAlertIcon(alert.type)}</div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-description">{alert.description}</div>
              <div className="alert-meta">{alert.metadata}</div>
            </div>
            <div className="alert-actions">
              <button className="alert-btn acknowledge" onClick={() => acknowledgeAlert(alert.id)}>
                ✓ Acknowledge
              </button>
              <button className="alert-btn dismiss" onClick={() => dismissAlert(alert.id)}>
                ✗ Dismiss
              </button>
            </div>
          </div>
        ))}
        
        {activeAlerts.length === 0 && (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <div>No active alerts</div>
            <div className="no-alerts-sub">All systems operational</div>
          </div>
        )}
      </div>
    </div>
  );
};