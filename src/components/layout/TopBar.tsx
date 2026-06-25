import React from 'react';
import { useViewStore } from '@/stores/viewStore';
import { useFeedStore } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import './TopBar.css';

// Import logo - only works if the file exists
import logoImage from '@/assets/logo.png';

export const TopBar: React.FC = () => {
  const { setView, currentView } = useViewStore();
  const { isLive } = useFeedStore();
  const { logout, user } = useAuthStore();

  const handleNavigation = (view: string) => {
    console.log('📍 TopBar: Navigating to:', view);
    setView(view);
  };

  const handleLogout = () => {
    logout();
    setView('overview');
    window.location.reload();
  };

  // 👇 Hidden exit method: double‑click the logo to exit full‑screen
  const handleLogoDoubleClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn('Exit fullscreen failed:', err));
    }
  };

  return (
    <div className="topbar">
      <div 
        className="logo-area" 
        onDoubleClick={handleLogoDoubleClick}
        style={{ cursor: 'pointer' }} // subtle hint that it's interactive
      >
        <img src={logoImage} alt="Logo" className="logo-image" />
        <div className="logo-text">
          <div className="logo-name">PEGASUS</div>
          <div className="logo-sub">NSO INTELLIGENCE PLATFORM</div>
        </div>
      </div>

      <div className="topbar-center">
        <div
          className={`top-nav ${currentView === 'overview' ? 'active' : ''}`}
          onClick={() => handleNavigation('overview')}
        >
          DASHBOARD
        </div>
        <div
          className={`top-nav ${currentView === 'cases' ? 'active' : ''}`}
          onClick={() => handleNavigation('cases')}
        >
          CASES
        </div>
        <div
          className={`top-nav ${currentView === 'reports' ? 'active' : ''}`}
          onClick={() => handleNavigation('reports')}
        >
          REPORTS
        </div>
        <div
          className={`top-nav ${currentView === 'admin' ? 'active' : ''}`}
          onClick={() => handleNavigation('admin')}
        >
          ADMIN
        </div>
        <div
          className={`top-nav ${currentView === 'osint' ? 'active' : ''}`}
          onClick={() => handleNavigation('osint')}
        >
          OSINT
        </div>
        <div
          className={`top-nav ${currentView === 'expert' ? 'active' : ''}`}
          onClick={() => handleNavigation('expert')}
        >
          EXPERT MODE
        </div>
      </div>

      <div className="topbar-right">
        <div className="status-badge">
          <div className="status-dot online"></div>
          <span className="status-text">System Online</span>
        </div>
        <div className="user-info" onClick={handleLogout}>
          <div className="user-avatar">OP</div>
          <div className="user-details">
            <span className="user-name">{user || 'Operator'} · LVL-3</span>
            <span className="logout-hint">Click to logout</span>
          </div>
          <div className="logout-icon">🚪</div>
        </div>
      </div>
    </div>
  );
};
