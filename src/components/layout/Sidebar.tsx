import React from 'react';
import { useViewStore } from '@/stores/viewStore';
import { useTargetStore } from '@/stores/targetStore';
import { useMessageStore } from '@/stores/messageStore';
import { useAlertStore } from '@/stores/alertStore';
import './Sidebar.css';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge?: string | number | (() => number);
}

const sections = [
  {
    label: 'SURVEILLANCE',
    items: [
      { id: 'overview', icon: '📊', label: 'Overview' },
      { id: 'phoneScan', label: 'Phone Scan', icon: '📡' },
      { id: 'targets', icon: '🎯', label: 'Targets', badge: () => useTargetStore.getState().targets.length },
      { id: 'livefeed', icon: '🔴', label: 'Live Feed', badge: 'LIVE' },
      { id: 'location', icon: '📍', label: 'Location' }
    ]
  },
  {
    label: 'DATA EXTRACTION',
    items: [
      { id: 'messages', icon: '💬', label: 'Messages', badge: () => useMessageStore.getState().getUnreadCount() },
      { id: 'calls', icon: '📞', label: 'Call Logs' },
      { id: 'media', icon: '📷', label: 'Media Gallery' },
      { id: 'keylogger', icon: '⌨️', label: 'Keylogger' },
      { id: 'browser', icon: '🌐', label: 'Browser History' },
      { id: 'contacts', icon: '👥', label: 'Contacts' },
      { id: 'email', icon: '📧', label: 'Email' },
      { id: 'passwords', icon: '🔑', label: 'Passwords' }
    ]
  },
  {
    label: 'REMOTE CONTROL',
    items: [
      { id: 'microphone', icon: '🎙️', label: 'Microphone' },
      { id: 'camera', icon: '📸', label: 'Camera' },
      { id: 'screen', icon: '🖥️', label: 'Screen Capture' }
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'infections', icon: '💉', label: 'Infection Vectors' },
      { id: 'alerts', icon: '🔔', label: 'Alerts', badge: () => useAlertStore.getState().getActiveAlerts().length },
      { id: 'settings', icon: '⚙️', label: 'Settings' }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { currentView, setView } = useViewStore();
  
  const getBadgeValue = (badge: NavItem['badge']): string | number | null => {
    if (typeof badge === 'function') {
      return badge();
    }
    return badge || null;
  };
  
  return (
    <div className="sidebar">
      {sections.map((section) => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-label">{section.label}</div>
          {section.items.map((item) => {
            const badgeValue = getBadgeValue(item.badge);
            return (
              <div
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
                {badgeValue !== null && badgeValue !== 0 && (
                  <div className={`badge ${item.badge === 'LIVE' ? 'green' : ''}`}>
                    {badgeValue}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
