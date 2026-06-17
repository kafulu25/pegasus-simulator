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
  const setTargets = useTargetStore((state) => state.setTargets);
  const startLiveStream = useFeedStore((state) => state.startLiveStream);
  const setView = useViewStore((state) => state.setView);

  useEffect(() => {
    if (isAuthenticated) {
      // 🛠️ FIX: Only load mock targets if the store is empty (first launch).
      // This prevents overwriting user-modified data on subsequent logins.
      const currentTargets = useTargetStore.getState().targets;
      if (currentTargets.length === 0) {
        setTargets(mockTargets);
      }

      // Start the live feed simulation (if not already running)
      startLiveStream();

      // Set default view only if no view is currently selected
      if (!useViewStore.getState().currentView) {
        setView('overview');
      }
    }
  }, [isAuthenticated, setTargets, startLiveStream, setView]);

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
