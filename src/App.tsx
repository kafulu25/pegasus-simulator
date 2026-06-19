import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useTargetStore } from './stores/targetStore';
import { useFeedStore } from './stores/feedStore';
import { useViewStore } from './stores/viewStore';
import { mockTargets } from './utils/mockData';
import { LoginPage } from './components/auth/LoginPage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewPanel } from './components/overview'; // only overview, no other panels
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const setTargets = useTargetStore((state) => state.setTargets);
  const startLiveStream = useFeedStore((state) => state.startLiveStream);
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);

  useEffect(() => {
    if (isAuthenticated) {
      useTargetStore.getState().loadFromStorage?.();
      const currentTargets = useTargetStore.getState().targets;
      if (currentTargets.length === 0) {
        setTargets(mockTargets);
      }
      startLiveStream();
      // Force set view to 'overview' if not set
      if (!currentView || currentView === '') {
        setView('overview');
      }
    }
  }, [isAuthenticated, setTargets, startLiveStream, setView, currentView]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={(username, password) => login(username)} />;
  }

  // For now, we only render OverviewPanel – later we'll add other panels
  return (
    <div className="app-container">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <div className="main-content">
          <OverviewPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
