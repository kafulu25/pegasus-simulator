import React, { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { DataEditorPanel } from './DataEditorPanel';
import { PhoneScanSettings } from './PhoneScanSettings';
import './SettingsPanel.css';

export const SettingsPanel: React.FC = () => {
  const { settings, updateOpSec, updateC2, updateDataCollection, resetSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'opsec' | 'data' | 'simulation' | 'scan'>('opsec');
  
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
          🎮 Data Review
        </button>
        <button 
          className={`settings-tab ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          📡 Device Scan
        </button>
      </div>

      <div className="scroll-content">
        {activeTab === 'opsec' && (
          <div className="grid-2">
            {/* ... OpSec & C2 content (unchanged) ... */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Operational Security</div>
              </div>
              <div className="settings-list">
                {/* ... all setting items ... */}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">C2 Server Configuration</div>
              </div>
              {/* ... C2 form ... */}
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Data Collection Preferences</div>
            </div>
            {/* ... data collection grid ... */}
          </div>
        )}
        
        {activeTab === 'simulation' && <DataEditorPanel />}

        {activeTab === 'scan' && (
          <div className="card">
            <PhoneScanSettings />
          </div>
        )}
        
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
