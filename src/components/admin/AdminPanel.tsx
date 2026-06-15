import React, { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import './AdminPanel.css';

export const AdminPanel: React.FC = () => {
  const { settings, resetSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'system' | 'backup'>('users');
  
  const mockUsers = [
    { id: 1, username: 'operator_7', role: 'Senior Operator', lastActive: new Date(), status: 'active', permissions: ['full_access', 'export', 'deploy'] },
    { id: 2, username: 'analyst_3', role: 'Intelligence Analyst', lastActive: new Date(Date.now() - 3600000), status: 'active', permissions: ['view', 'export'] },
    { id: 3, username: 'admin_1', role: 'System Administrator', lastActive: new Date(Date.now() - 7200000), status: 'active', permissions: ['full_access', 'admin'] },
  ];
  
  const mockAuditLogs = [
    { id: 1, user: 'operator_7', action: 'Deployed Pegasus agent', target: 'Ahmad Karimi', timestamp: new Date(), ip: '192.168.1.100' },
    { id: 2, user: 'analyst_3', action: 'Exported call logs', target: 'Leila Nazari', timestamp: new Date(Date.now() - 3600000), ip: '192.168.1.101' },
    { id: 3, user: 'admin_1', action: 'Modified system settings', target: 'System', timestamp: new Date(Date.now() - 7200000), ip: '192.168.1.1' },
  ];
  
  const systemHealth = {
    status: 'healthy',
    uptime: '14 days, 8 hours',
    cpu: '23%',
    memory: '45%',
    storage: '2.4 TB / 5 TB',
    activeConnections: 12,
  };
  
  return (
    <div className="admin-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🛡️</span> Administration
          </div>
          <div className="panel-subtitle">System management and configuration</div>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          👥 User Management
        </button>
        <button className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
          📋 Audit Logs
        </button>
        <button className={`admin-tab ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
          ⚙️ System Health
        </button>
        <button className={`admin-tab ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>
          💾 Backup & Restore
        </button>
      </div>
      
      <div className="scroll-content">
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>User Accounts</h3>
              <button className="btn-add-user" onClick={() => alert('Add user form would open here')}>+ Add User</button>
            </div>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(user => (
                    <tr key={user.id}>
                      <td className="username-cell">{user.username}</td>
                      <td>{user.role}</td>
                      <td>{user.lastActive.toLocaleString()}</td>
                      <td><span className="status-badge active">{user.status}</span></td>
                      <td>{user.permissions.join(', ')}</td>
                      <td>
                        <button className="action-btn edit">Edit</button>
                        <button className="action-btn delete">Disable</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'audit' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Audit Trail</h3>
              <div className="audit-filters">
                <input type="text" placeholder="Filter by user..." className="filter-input" />
                <input type="date" className="filter-input" />
                <button className="btn btn-ghost">Export Logs</button>
              </div>
            </div>
            <div className="audit-logs">
              {mockAuditLogs.map(log => (
                <div key={log.id} className="audit-entry">
                  <div className="audit-header">
                    <span className="audit-user">👤 {log.user}</span>
                    <span className="audit-time">{log.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="audit-action">{log.action}</div>
                  <div className="audit-target">Target: {log.target}</div>
                  <div className="audit-ip">IP: {log.ip}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="admin-section">
            <div className="system-status">
              <div className={`status-indicator ${systemHealth.status === 'healthy' ? 'healthy' : 'warning'}`}>
                System Status: {systemHealth.status.toUpperCase()}
              </div>
              <div className="system-grid">
                <div className="system-card">
                  <div className="system-label">Uptime</div>
                  <div className="system-value">{systemHealth.uptime}</div>
                </div>
                <div className="system-card">
                  <div className="system-label">CPU Usage</div>
                  <div className="system-value">{systemHealth.cpu}</div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: systemHealth.cpu }}></div></div>
                </div>
                <div className="system-card">
                  <div className="system-label">Memory Usage</div>
                  <div className="system-value">{systemHealth.memory}</div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: systemHealth.memory }}></div></div>
                </div>
                <div className="system-card">
                  <div className="system-label">Storage</div>
                  <div className="system-value">{systemHealth.storage}</div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '48%' }}></div></div>
                </div>
                <div className="system-card">
                  <div className="system-label">Active Connections</div>
                  <div className="system-value">{systemHealth.activeConnections}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'backup' && (
          <div className="admin-section">
            <div className="backup-section">
              <div className="backup-card">
                <div className="backup-icon">💾</div>
                <div className="backup-info">
                  <h4>Manual Backup</h4>
                  <p>Create a full backup of all surveillance data and configurations</p>
                  <button className="btn btn-primary" onClick={() => alert('Backup initiated')}>Create Backup</button>
                </div>
              </div>
              <div className="backup-card">
                <div className="backup-icon">🔄</div>
                <div className="backup-info">
                  <h4>Restore from Backup</h4>
                  <p>Restore system from a previous backup point</p>
                  <select className="backup-select">
                    <option>Backup_2024-02-10_120000.zip</option>
                    <option>Backup_2024-02-09_000000.zip</option>
                    <option>Backup_2024-02-08_000000.zip</option>
                  </select>
                  <button className="btn btn-warning" onClick={() => alert('Restore confirmed')}>Restore</button>
                </div>
              </div>
              <div className="backup-card">
                <div className="backup-icon">⚙️</div>
                <div className="backup-info">
                  <h4>Auto-Backup Settings</h4>
                  <p>Configure automatic backup schedule</p>
                  <select className="backup-select">
                    <option>Daily at 02:00</option>
                    <option>Weekly on Sunday</option>
                    <option>Monthly</option>
                  </select>
                  <button className="btn btn-ghost">Save Settings</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};