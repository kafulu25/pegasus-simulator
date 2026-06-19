import React, { useEffect, useState } from 'react';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { useAuthStore } from './stores/authStore';
import { useViewStore } from './stores/viewStore';
import { useFeedStore } from './stores/feedStore';
import { useTargetStore } from './stores/targetStore';
import { mockTargets } from './utils/mockData';
import './App.css';

// Import all panels – using explicit file paths to avoid index.ts issues
import { OverviewPanel } from './components/overview/OverviewPanel';
import { TargetsPanel } from './components/targets/TargetsPanel';
import { LiveFeedPanel } from './components/livefeed/LiveFeedPanel';
import { LocationPanel } from './components/location/LocationPanel';
import { MessagesPanel } from './components/messages/MessagesPanel';
import { CallsPanel } from './components/calls/CallsPanel';
import { MediaPanel } from './components/media/MediaPanel';
import { KeyloggerPanel } from './components/keylogger/KeyloggerPanel';
import { BrowserPanel } from './components/browser/BrowserPanel';
import { ContactsPanel } from './components/contacts/ContactsPanel';
import { EmailPanel } from './components/email/EmailPanel';
import { PasswordsPanel } from './components/passwords/PasswordsPanel';
import { MicrophonePanel } from './components/microphone/MicrophonePanel';
import { CameraPanel } from './components/camera/CameraPanel';
import { ScreenPanel } from './components/screen/ScreenPanel';
import { InfectionsPanel } from './components/infections/InfectionsPanel';
import { AlertsPanel } from './components/alerts/AlertsPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { CasesPanel } from './components/cases/CasesPanel';
import { ReportsPanel } from './components/reports/ReportsPanel';
import { AdminPanel } from './components/admin/AdminPanel';
import { OsintPanel } from './components/osint/OsintPanel';
// ExpertMode is default export – fixed import
import ExpertMode from './components/expert/ExpertMode';
// PhoneScan – if you have it, uncomment and add to panelMap
// import PhoneScanPanel from './components/phoneScan/PhoneScan';

const panelMap: Record<string, React.ComponentType> = {
  overview: OverviewPanel,
  targets: TargetsPanel,
  livefeed: LiveFeedPanel,
  location: LocationPanel,
  messages: MessagesPanel,
  calls: CallsPanel,
  media: MediaPanel,
  keylogger: KeyloggerPanel,
  browser: BrowserPanel,
  contacts: ContactsPanel,
  email: EmailPanel,
  passwords: PasswordsPanel,
  microphone: MicrophonePanel,
  camera: CameraPanel,
  screen: ScreenPanel,
  infections: InfectionsPanel,
  alerts: AlertsPanel,
  settings: SettingsPanel,
  cases: CasesPanel,
  reports: ReportsPanel,
  admin: AdminPanel,
  osint: OsintPanel,
  expert: ExpertMode,
  // phoneScan: PhoneScanPanel, // uncomment if needed
};

function App() {
  // ALL hooks at top level
  const { isAuthenticated, login } = useAuthStore();
  const { setTargets } = useTargetStore();
  const { startLiveStream } = useFeedStore();
  const { setView, currentView } = useViewStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize data
    setTargets(mockTargets);
    setIsInitialized(true);
    
    // Check if already authenticated from localStorage
    const storedAuth = localStorage.getItem('pegasus-auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.state?.isAuthenticated) {
          login(parsed.state.user);
          setView('overview');
          startLiveStream();
        }
      } catch (e) {
        console.error('Failed to parse auth:', e);
      }
    }
  }, []); // runs once

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'pegasus2024') {
      login(username);
      setView('overview');
      startLiveStream();
    } else {
      // Let LoginPage handle error display – we just return false to trigger error
      // Actually the LoginPage already shows error; we just don't login.
      // We'll return false, but LoginPage doesn't check return value.
      // The login function will not be called, so the error will be shown.
    }
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  const ActivePanel = panelMap[currentView] || OverviewPanel;

  return (
    <div className="app">
      <TopBar />
      <div className="main-layout">
        <Sidebar />
        <div className="content">
          <ActivePanel />
        </div>
      </div>
    </div>
  );
}

export default App;
