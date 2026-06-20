import React from 'react';
import { LiveMap } from './LiveMap';
import { MovementHistory } from './MovementHistory';
import { LocationTable } from './LocationTable';
import './LocationPanel.css';

// Simple inline error boundary (since we already have ErrorBoundary.tsx, we can import it)
// But to avoid extra imports, we'll create a small local wrapper.
class SafeComponent extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`Error in ${this.props.name}:`, error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff4444', background: '#1a0a0a', border: '1px solid #ff4444', borderRadius: '4px' }}>
          ⚠️ Something went wrong in <strong>{this.props.name}</strong>. Check the console for details.
        </div>
      );
    }
    return this.props.children;
  }
}

const showToast = (type: string, title: string, message: string) => {
  alert(`${title}\n${message}`);
};

export const LocationPanel: React.FC = () => {
  return (
    <div className="location-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📍</span> Location Tracking
          </div>
          <div className="panel-subtitle">GPS tracking & movement history</div>
        </div>
        <button className="btn-set-geofence" onClick={() => showToast('info', 'Geofence set', 'Alert will trigger when target leaves zone.')}>
          + Set Geofence
        </button>
      </div>
      <div className="scroll-content">
        <div className="grid-2">
          <SafeComponent name="LiveMap">
            <LiveMap />
          </SafeComponent>
          <SafeComponent name="MovementHistory">
            <MovementHistory />
          </SafeComponent>
        </div>
        <SafeComponent name="LocationTable">
          <LocationTable />
        </SafeComponent>
      </div>
    </div>
  );
};
