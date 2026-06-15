import React, { useEffect, useRef } from 'react';
import { useFeedStore } from '@/stores/feedStore';
import { useTargetStore } from '@/stores/targetStore';
import { formatDistanceToNow } from 'date-fns';
import './RecentActivityFeed.css';

export const RecentActivityFeed: React.FC = () => {
  const { events, addEvent } = useFeedStore();
  const { targets } = useTargetStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate random activity events
  const generateRandomEvent = () => {
    // Get real target names from the targets store
    const targetNames = targets.length > 0 
      ? targets.map(t => t.name)
      : ['Ahmad Karimi', 'Leila Nazari', 'Marcus Webb', 'Sara Petrov'];
    
    const randomTarget = targetNames[Math.floor(Math.random() * targetNames.length)];
    // Find the target ID for the selected target name
    const targetObj = targets.find(t => t.name === randomTarget);
    const targetId = targetObj?.id || Math.floor(Math.random() * 4) + 1;
    
    const eventTypes = ['message', 'location', 'call', 'keylog', 'camera', 'microphone'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const apps = ['WhatsApp', 'Signal', 'Telegram', 'Cellular', 'GPS', 'Camera'];
    const randomApp = apps[Math.floor(Math.random() * apps.length)];
    
    const messages = [
      'New encrypted message received',
      'GPS location updated',
      'Call recording saved',
      'Keystroke capture detected',
      'App opened: Signal',
      'Photo captured via front camera',
      'Location shared with contact',
      'File downloaded from cloud',
      'Microphone activated',
      'Screen capture taken',
      'Password entered',
      'Contact added',
      'Email sent',
      'Browser history cleared',
      'VPN connection established',
      'WhatsApp backup detected',
      'Telegram secret chat initiated',
      'Signal registration detected'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const newEvent = {
  id: String(Date.now() + Math.random()),  // Convert to string
      targetId: targetId,
      targetName: randomTarget,
      type: randomType as any,
      app: randomApp,
      message: randomMessage,
      severity: Math.random() > 0.7 ? 'critical' : 'info' as any,
      timestamp: new Date(),
    };
    
    addEvent(newEvent);
    
    // Schedule next event with 1 minute delay
    scheduleNextEvent();
  };
  
  // Function to get current target name (always up to date)
  const getCurrentTargetName = (targetId: number, fallbackName: string): string => {
    const target = targets.find(t => t.id === targetId);
    return target?.name || fallbackName;
  };
  
  // Function to set exactly 1 minute interval (60000 ms)
  const scheduleNextEvent = () => {
    const oneMinuteDelay = 60000; // 1 minute in milliseconds
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      generateRandomEvent();
    }, oneMinuteDelay);
  };
  
  useEffect(() => {
    // Start the endless loop with 1 minute delay
    scheduleNextEvent();
    
    // Cleanup on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targets]); // Re-run when targets change to ensure new targets are used
  
  const getEventIcon = (type: string): string => {
    const icons: Record<string, string> = {
      message: '💬',
      location: '📍',
      call: '📞',
      keylog: '⌨️',
      camera: '📷',
      microphone: '🎙️',
      app: '📱',
    };
    return icons[type] || '⚡';
  };
  
  const recentEvents = events.slice(0, 10);
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Recent Activity</div>
        <button 
          className="btn-view-live" 
          onClick={() => window.location.href = '#livefeed'}
        >
          View Live →
        </button>
      </div>
      <div className="activity-feed">
        {recentEvents.length === 0 ? (
          <div className="feed-empty">Awaiting activity...</div>
        ) : (
          recentEvents.map((event, index) => (
            <div key={event.id} className={`feed-item ${index === 0 ? 'new' : ''}`}>
              <div className="feed-time">
                {formatDistanceToNow(event.timestamp, { addSuffix: true }).replace('less than a minute ago', 'few minutes ago')}
              </div>
              <div className="feed-icon">{getEventIcon(event.type)}</div>
              <div className="feed-content">
                <span className="feed-target">
                  {getCurrentTargetName(event.targetId, event.targetName)}
                </span>
                <span className="feed-message"> — {event.message}</span>
                <span className="feed-app">[{event.app}]</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};