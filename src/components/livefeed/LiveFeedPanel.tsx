import React, { useRef, useEffect } from 'react';
import { useFeedStore } from '@/stores/feedStore';
import { FeedItem } from './FeedItem';
import './LiveFeedPanel.css';

export const LiveFeedPanel: React.FC = () => {
  const { events, isLive, clearEvents, startLiveStream, stopLiveStream } = useFeedStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isLive) {
      startLiveStream();
    }
    return () => {
      stopLiveStream();
    };
  }, []);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [events]);
  
  return (
    <div className="livefeed-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🔴</span> Live Intelligence Feed
          </div>
          <div className="panel-subtitle">Real-time events from all active targets</div>
        </div>
        <div className="flex gap-8 items-center">
          <div className={`rec-indicator ${isLive ? 'live' : ''}`}>
            <div className="rec-dot"></div>
            {isLive ? 'LIVE' : 'OFFLINE'}
          </div>
          <button className="btn btn-ghost" onClick={clearEvents}>
            Clear Feed
          </button>
        </div>
      </div>
      <div className="feed-container" ref={containerRef}>
        {events.length === 0 ? (
          <div className="feed-empty">
            <div className="empty-icon">📡</div>
            <div>Waiting for intelligence data...</div>
            <div className="empty-sub">Live feed will appear here</div>
          </div>
        ) : (
          events.map((event, index) => (
            <FeedItem key={event.id} event={event} index={index} />
          ))
        )}
      </div>
    </div>
  );
};