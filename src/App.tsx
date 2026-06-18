import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useTargetStore } from './stores/targetStore';
import { useFeedStore } from './stores/feedStore';
import { useViewStore } from './stores/viewStore';
import { mockTargets } from './utils/mockData';
import { LoginPage } from './components/auth/LoginPage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const targets = useTargetStore((state) => state.targets);
  const hasHydrated = useTargetStore((state) => state._hasHydrated);
  const setTargets = useTargetStore((state) => state.setTargets);
  const startLiveStream = useFeedStore((state) => state.startLiveStream);
  const setView = useViewStore((state) => state.setView);

  useEffect(() => {
    if (!isAuthenticated || !hasHydrated) return;

    if (targets.length === 0) {
      console.log('First launch: Loading default mock targets');
      setTargets(mockTargets);
    } else {
      console.log('Existing data found. Keeping user-modified data.');
    }

    startLiveStream();

    if (!useViewStore.getState().currentView) {
      setView('overview');
    }
  }, [isAuthenticated, hasHydrated, targets.length, setTargets, startLiveStream, setView]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
