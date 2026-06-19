import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useTargetStore } from './stores/targetStore';
import { useFeedStore } from './stores/feedStore';
import { useViewStore } from './stores/viewStore';
import { useAlertStore } from './stores/alertStore';
import { mockTargets } from './utils/mockData';
import { LoginPage } from './components/auth/LoginPage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import Overview from './components/overview/Overview';
import Targets from './components/targets/Targets';
import Messages from './components/messages/Messages';
import Calls from './components/calls/Calls';
import Contacts from './components/contacts/Contacts';
import Location from './components/location/Location';
import Camera from './components/camera/Camera';
import Microphone from './components/microphone/Microphone';
import Keylogger from './components/keylogger/Keylogger';
import Media from './components/media/Media';
import Browser from './components/browser/Browser';
import Email from './components/email/Email';
import Passwords from './components/passwords/Passwords';
import Settings from './components/settings/Settings';
import Admin from './components/admin/Admin';
import Alerts from './components/alerts/Alerts';
import Cases from './components/cases/Cases';
import Expert from './components/expert/Expert';
import Feed from './components/feed/Feed';
import Reports from './components/reports/Reports';
import Screen from './components/screen/Screen';
import Osint from './components/osint/Osint';
import LiveFeed from './components/livefeed/LiveFeed';
import PhoneScan from './components/phoneScan/PhoneScan'; // <-- NEW
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
      useTargetStore.getState().loadFromStorage();
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
