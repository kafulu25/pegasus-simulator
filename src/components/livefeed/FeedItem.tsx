import React from 'react';
import { FeedEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import './FeedItem.css';

interface FeedItemProps {
  event: FeedEvent;
  index: number;
}

export const FeedItem: React.FC<FeedItemProps> = ({ event, index }) => {
  const getEventIcon = () => {
    const icons: Record<string, string> = {
      message: '💬',
      location: '📍',
      call: '📞',
      keylog: '⌨️',
      camera: '📷',
      microphone: '🎙️',
      app: '📱',
    };
    return icons[event.type] || '⚡';
  };
  
  const getSeverityClass = () => {
    switch (event.severity) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };
  
  return (
    <div className={`feed-item ${getSeverityClass()}`} style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="feed-time">
        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
      </div>
      <div className="feed-icon">{getEventIcon()}</div>
      <div className="feed-content">
        <span className="feed-target">{event.targetName}</span>
        <span className="feed-message"> — {event.message}</span>
        <span className="feed-app">[{event.app}]</span>
      </div>
      <div className="feed-severity">
        <div className={`severity-dot ${getSeverityClass()}`}></div>
      </div>
    </div>
  );
};