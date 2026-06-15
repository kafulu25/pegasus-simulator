import React, { useState } from 'react';
import { useCallStore } from '@/stores/callStore';
import { format } from 'date-fns';
import './CallsPanel.css';

export const CallsPanel: React.FC = () => {
  const { calls, toggleRecording, isPlaying, currentPlayingId } = useCallStore();
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  
  const filteredCalls = calls.filter(call => 
    filter === 'all' ? true : call.direction === filter
  );
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const handlePlayRecording = (callId: number) => {
    toggleRecording(callId);
    setTimeout(() => toggleRecording(callId), 3000);
  };
  
  return (
    <div className="calls-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📞</span> Call Logs & Recordings
          </div>
          <div className="panel-subtitle">Intercept logs, durations, and recorded audio</div>
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'incoming' ? 'active' : ''}`}
            onClick={() => setFilter('incoming')}
          >
            Incoming
          </button>
          <button 
            className={`filter-btn ${filter === 'outgoing' ? 'active' : ''}`}
            onClick={() => setFilter('outgoing')}
          >
            Outgoing
          </button>
        </div>
      </div>
      <div className="scroll-content">
        <table className="calls-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Direction</th>
              <th>Number / Contact</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Recording</th>
              <th>App</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map((call) => (
              <tr key={call.id}>
                <td className="target-cell">{call.targetName}</td>
                <td>
                  <span className={`direction-badge ${call.direction}`}>
                    {call.direction === 'incoming' ? '📲 Incoming' : '📤 Outgoing'}
                  </span>
                </td>
                <td className="number-cell">{call.number}</td>
                <td className="date-cell">{format(call.date, 'MMM dd, HH:mm')}</td>
                <td className="duration-cell">{formatDuration(call.duration)}</td>
                <td>
                  {call.hasRecording ? (
                    <button 
                      className={`play-btn ${currentPlayingId === call.id && isPlaying ? 'playing' : ''}`}
                      onClick={() => handlePlayRecording(call.id)}
                    >
                      {currentPlayingId === call.id && isPlaying ? '⏸ Playing...' : '▶ Play'}
                    </button>
                  ) : (
                    <span className="no-recording">—</span>
                  )}
                </td>
                <td>
                  <span className="app-badge">{call.app}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};