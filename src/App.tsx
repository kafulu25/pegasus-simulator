import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useTargetStore } from './stores/targetStore';
import { useFeedStore } from './stores/feedStore';
import { useViewStore } from './stores/viewStore';
import { mockTargets } from './utils/mockData';
import { LoginPage } from './components/auth/LoginPage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';

// Import each panel component using named exports
import { OverviewPanel } from './components/overview';
import { TargetsPanel } from './components/targets';
import { MessagesPanel } from './components/messages';
import { CallsPanel } from './components/calls';
import { ContactsPanel } from './components/contacts';
import { LocationPanel } from './components/location';
import { CameraPanel } from './components/camera';
import { MicrophonePanel } from './components/microphone';
import { KeyloggerPanel } from './components/keylogger';
import { MediaPanel } from './components/media';
import { BrowserPanel } from './components/browser';
import { EmailPanel } from './components/email';
import { PasswordsPanel } from './components/passwords';
import { SettingsPanel } from './components/settings';
import { AdminPanel } from './components/admin';
import { AlertsPanel } from './components/alerts';
import { CasesPanel } from './components/cases';
import { ExpertPanel } from './components/expert';
import { ReportsPanel } from './components/reports';
import { ScreenPanel } from './components/screen';
import { OsintPanel } from './components/osint';
import { LiveFeedPanel } from './components/livefeed';
import { PhoneScanPanel } from './components/phoneScan';

import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const setTargets = useTargetStore((state) => state.setTargets);
  const startLiveStream = useFeedStore((state) => state.startLiveStream);
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);

  // On login, load data and set default view if needed
  useEffect(() => {
    if (isAuthenticated) {
      useTargetStore.getState().loadFromStorage?.();
      const currentTargets = useTargetStore.getState().targets;
      if (currentTargets.length === 0) {
        setTargets(mockTargets);
      }
      startLiveStream();
      
      // ✅ Force set view to 'overview' if it's not set or is an empty string
      const view = useViewStore.getState().currentView;
      if (!view || view === '') {
        setView('overview');
      }
    }
  }, [isAuthenticated, setTargets, startLiveStream, setView]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={(username, password) => login(username)} />;
  }

  // Map views to panel components
  const viewComponents: Record<string, React.ReactNode> = {
    overview: <OverviewPanel />,
    targets: <TargetsPanel />,
    messages: <MessagesPanel />,
    calls: <CallsPanel />,
    contacts: <ContactsPanel />,
    location: <LocationPanel />,
    camera: <CameraPanel />,
    microphone: <MicrophonePanel />,
    keylogger: <KeyloggerPanel />,
    media: <MediaPanel />,
    browser: <BrowserPanel />,
    email: <EmailPanel />,
    passwords: <PasswordsPanel />,
    settings: <SettingsPanel />,
    admin: <AdminPanel />,
    alerts: <AlertsPanel />,
    cases: <CasesPanel />,
    expert: <ExpertPanel />,
    reports: <ReportsPanel />,
    screen: <ScreenPanel />,
    osint: <OsintPanel />,
    livefeed: <LiveFeedPanel />,
    phoneScan: <PhoneScanPanel />,
  };

  // ✅ Always use a fallback – even if currentView is missing
  const component = viewComponents[currentView] || <OverviewPanel />;

  return (
    <div className="app-container">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <div className="main-content">
          {component}
        </div>
      </div>
    </div>
  );
}

export default App;
