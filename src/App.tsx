import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useTargetStore } from './stores/targetStore';
import { useFeedStore } from './stores/feedStore';
import { useViewStore } from './stores/viewStore';
import { mockTargets } from './utils/mockData';
import { LoginPage } from './components/auth/LoginPage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import Overview from './components/overview';
import Targets from './components/targets';
import Messages from './components/messages';
import Calls from './components/calls';
import Contacts from './components/contacts';
import Location from './components/location';
import Camera from './components/camera';
import Microphone from './components/microphone';
import Keylogger from './components/keylogger';
import Media from './components/media';
import Browser from './components/browser';
import Email from './components/email';
import Passwords from './components/passwords';
import Settings from './components/settings';
import Admin from './components/admin';
import Alerts from './components/alerts';
import Cases from './components/cases';
import Expert from './components/expert';
import Feed from './components/feed';
import Reports from './components/reports';
import Screen from './components/screen';
import Osint from './components/osint';
import LiveFeed from './components/livefeed';
import PhoneScan from './components/phoneScan'; // <-- NEW
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setTargets = useTargetStore((state) => state.setTargets);
  const startLiveStream = useFeedStore((state) => state.startLiveStream);
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);

  // Load targets from localStorage on auth
  useEffect(() => {
    if (isAuthenticated) {
      useTargetStore.getState().loadFromStorage?.();
      const currentTargets = useTargetStore.getState().targets;
      if (currentTargets.length === 0) {
        setTargets(mockTargets);
      }
      startLiveStream();
      if (!useViewStore.getState().currentView) {
        setView('overview');
      }
    }
  }, [isAuthenticated, setTargets, startLiveStream, setView]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Map views to components
  const viewComponents: Record<string, React.ReactNode> = {
    overview: <Overview />,
    targets: <Targets />,
    messages: <Messages />,
    calls: <Calls />,
    contacts: <Contacts />,
    location: <Location />,
    camera: <Camera />,
    microphone: <Microphone />,
    keylogger: <Keylogger />,
    media: <Media />,
    browser: <Browser />,
    email: <Email />,
    passwords: <Passwords />,
    settings: <Settings />,
    admin: <Admin />,
    alerts: <Alerts />,
    cases: <Cases />,
    expert: <Expert />,
    feed: <Feed />,
    reports: <Reports />,
    screen: <Screen />,
    osint: <Osint />,
    livefeed: <LiveFeed />,
    phoneScan: <PhoneScan />, // <-- NEW
  };

  return (
    <div className="app-container">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <div className="main-content">
          {viewComponents[currentView] || <Overview />}
        </div>
      </div>
    </div>
  );
}

export default App;
