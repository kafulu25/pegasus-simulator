import React from 'react';
import { usePhoneScanSettingsStore } from '../../stores/phoneScanSettingsStore';

export const PhoneScanSettings: React.FC = () => {
  const { settings, updateSettings } = usePhoneScanSettingsStore();

  const handleChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <div style={{ padding: '16px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px' }}>
      <h3 style={{ color: '#0193c6', marginBottom: '16px' }}>📡 Device Scan Settings</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>
          Associated Numbers (comma separated)
        </label>
        <input
          type="text"
          value={settings.targetPhoneNumbers.join(', ')}
          onChange={(e) =>
            handleChange('targetPhoneNumbers', e.target.value.split(',').map(s => s.trim()))
          }
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '4px',
            color: '#e6edf3',
            fontSize: '14px',
          }}
        />
        <p style={{ fontSize: '11px', color: '#8b949e', marginTop: '4px' }}>
          These numbers will appear as associated contacts in the scan report.
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>
          Installed Apps (comma separated)
        </label>
        <input
          type="text"
          value={settings.appList.join(', ')}
          onChange={(e) =>
            handleChange('appList', e.target.value.split(',').map(s => s.trim()))
          }
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '4px',
            color: '#e6edf3',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>
          Message Templates (comma separated)
        </label>
        <input
          type="text"
          value={settings.messageTemplates.join(', ')}
          onChange={(e) =>
            handleChange('messageTemplates', e.target.value.split(',').map(s => s.trim()))
          }
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '4px',
            color: '#e6edf3',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>
          Coordinate Range (min/max lat, min/max lng)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input
            type="number"
            step="0.001"
            placeholder="Min Lat"
            value={settings.coordinateRange.latMin}
            onChange={(e) =>
              handleChange('coordinateRange', {
                ...settings.coordinateRange,
                latMin: parseFloat(e.target.value),
              })
            }
            style={{
              padding: '8px 12px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '4px',
              color: '#e6edf3',
            }}
          />
          <input
            type="number"
            step="0.001"
            placeholder="Max Lat"
            value={settings.coordinateRange.latMax}
            onChange={(e) =>
              handleChange('coordinateRange', {
                ...settings.coordinateRange,
                latMax: parseFloat(e.target.value),
              })
            }
            style={{
              padding: '8px 12px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '4px',
              color: '#e6edf3',
            }}
          />
          <input
            type="number"
            step="0.001"
            placeholder="Min Lng"
            value={settings.coordinateRange.lngMin}
            onChange={(e) =>
              handleChange('coordinateRange', {
                ...settings.coordinateRange,
                lngMin: parseFloat(e.target.value),
              })
            }
            style={{
              padding: '8px 12px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '4px',
              color: '#e6edf3',
            }}
          />
          <input
            type="number"
            step="0.001"
            placeholder="Max Lng"
            value={settings.coordinateRange.lngMax}
            onChange={(e) =>
              handleChange('coordinateRange', {
                ...settings.coordinateRange,
                lngMax: parseFloat(e.target.value),
              })
            }
            style={{
              padding: '8px 12px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '4px',
              color: '#e6edf3',
            }}
          />
        </div>
        <p style={{ fontSize: '11px', color: '#8b949e', marginTop: '4px' }}>
          GPS coordinates will be randomly generated within this range.
        </p>
      </div>

      {/* ✅ NEW: Failure Simulation Toggle */}
      <div style={{ 
        marginBottom: '16px',
        padding: '12px 16px',
        background: 'rgba(255, 68, 68, 0.05)',
        border: '1px solid rgba(255, 68, 68, 0.2)',
        borderRadius: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#e6edf3', fontSize: '14px', fontWeight: '500' }}>⚠️ Payload Status</div>
            <div style={{ fontSize: '11px', color: '#8b949e', marginTop: '2px' }}>
              When ON, the scan will check whether payload is reachable or not.
            </div>
          </div>
          <label className="toggle-switch" style={{ flexShrink: 0, marginLeft: '16px' }}>
            <input
              type="checkbox"
              checked={settings.simulateFailure || false}
              onChange={(e) => handleChange('simulateFailure', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #30363d', paddingTop: '12px', marginTop: '8px' }}>
        <p style={{ fontSize: '11px', color: '#8b949e' }}>
          These settings affect future Device Scans. Changes will be persisted automatically.
        </p>
      </div>
    </div>
  );
};
