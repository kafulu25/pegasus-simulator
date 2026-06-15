import React, { useState } from 'react';
import './ScreenPanel.css';

interface Screenshot {
  id: number;
  targetName: string;
  timestamp: Date;
  size: number;
}

export const ScreenPanel: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [scheduleInterval, setScheduleInterval] = useState('30');
  const [showCaution, setShowCaution] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  
  const mockApps = [
    { name: 'WhatsApp', content: 'meeting cancelled tomorrow, new plan is...', time: '14:22' },
    { name: 'Signal', content: 'Contact: [REDACTED] · typing...', time: '14:20' },
    { name: 'Notes', content: 'Meeting notes: 3pm with source...', time: '14:15' },
  ];
  
  const takeScreenshot = () => {
    const newScreenshot = {
      id: Date.now(),
      targetName: 'Marcus Webb',
      timestamp: new Date(),
      size: Math.floor(Math.random() * 1000000) + 500000
    };
    setScreenshots(prev => [newScreenshot, ...prev].slice(0, 20));
  };
  
  const handleViewScreenshot = (screenshot: Screenshot) => {
    setSelectedScreenshot(screenshot);
    setShowCaution(true);
  };
  
  const requestDecryption = () => {
    alert('🔐 Screenshot decryption request submitted.\n\n' +
          'Estimated processing time: 12-24 hours.\n' +
          'You will be notified when decryption is complete.\n\n' +
          'Request ID: ' + Math.random().toString(36).substring(2, 15).toUpperCase());
    setShowCaution(false);
  };
  
  const startSchedule = () => {
    alert(`📸 Screenshot schedule set: Every ${scheduleInterval} seconds`);
    const interval = setInterval(() => {
      takeScreenshot();
    }, parseInt(scheduleInterval) * 1000);
    setTimeout(() => clearInterval(interval), 30000); // Auto-stop after 30 seconds for demo
  };
  
  return (
    <div className="screen-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🖥️</span> Screen Capture
          </div>
          <div className="panel-subtitle">Real-time screen mirroring & scheduled snapshots</div>
        </div>
      </div>
      <div className="scroll-content">
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Live Screen — Marcus Webb</div>
              <div className={`screen-status ${isRecording ? 'recording' : ''}`}>
                {isRecording ? '● REC' : '○ IDLE'}
              </div>
            </div>
            <div className="screen-mirror">
              <div className="mirror-content">
                {mockApps.map((app, i) => (
                  <div key={i} className="mirror-app">
                    <div className="app-header">
                      <span className="app-name">{app.name}</span>
                      <span className="app-time">{app.time}</span>
                    </div>
                    <div className="app-content">{app.content}</div>
                  </div>
                ))}
              </div>
              <div className="mirror-status">
                [Simulated screen mirror — 1080x2340px | HDCP Encrypted]
              </div>
            </div>
            <div className="screen-actions">
              <button className="btn btn-primary" onClick={takeScreenshot}>
                📷 Take Snapshot
              </button>
              <button className={`btn ${isRecording ? 'btn-danger' : 'btn-ghost'}`} onClick={() => setIsRecording(!isRecording)}>
                {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
              </button>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="card-title">Schedule Captures</div>
            </div>
            <div className="form-row">
              <label className="form-label">Target</label>
              <select className="form-select">
                <option>Marcus Webb</option>
                <option>Ahmad Karimi</option>
                <option>Leila Nazari</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Interval</label>
              <select className="form-select" value={scheduleInterval} onChange={(e) => setScheduleInterval(e.target.value)}>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 1 minute</option>
                <option value="300">Every 5 minutes</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Duration</label>
              <select className="form-select">
                <option>1 Hour</option>
                <option>4 Hours</option>
                <option>Until Stopped</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={startSchedule}>
              ▶ Start Schedule
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Captured Screenshots Archive</div>
            <span className="archive-count">{screenshots.length} captures</span>
          </div>
          <div className="capture-history">
            {screenshots.map((screenshot) => (
              <div key={screenshot.id} className="history-item" onClick={() => handleViewScreenshot(screenshot)}>
                <div className="history-time">{new Date(screenshot.timestamp).toLocaleTimeString()}</div>
                <div className="history-thumb">🖥️</div>
                <div className="history-details">
                  <div>screenshot_{screenshot.id}.heic</div>
                  <div className="history-size">~{(screenshot.size / 1024).toFixed(0)} KB</div>
                  <div className="encrypted-tag">🔒 DRM Protected</div>
                </div>
                <button className="view-btn">View</button>
              </div>
            ))}
            {screenshots.length === 0 && (
              <div className="no-captures">
                <div className="no-captures-icon">🖥️</div>
                <div>No screenshots yet. Take a snapshot or start a schedule.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Caution Modal */}
      {showCaution && selectedScreenshot && (
        <div className="modal-overlay" onClick={() => setShowCaution(false)}>
          <div className="caution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="caution-header">
              <div className="caution-icon">🖥️</div>
              <div className="caution-title">DRM PROTECTED SCREEN CAPTURE</div>
              <button className="caution-close" onClick={() => setShowCaution(false)}>✕</button>
            </div>
            <div className="caution-body">
              <div className="caution-message">
                This screen capture is protected with DRM and hardware-based encryption.
                
                Encryption Details:
                • Protocol: HDCP 2.2 / Widevine L1
                • Capture Method: Hardware frame buffer extraction
                • Watermark: Digital forensic watermark embedded
                
                Technical Analysis:
                • Screen capture bypassed HDCP protection
                • Forensic watermark contains: Device ID, Timestamp, Operator ID
                • Modified JPEG headers detected
                • Pixel obfuscation algorithm identified
                • Anti-screenshot countermeasures triggered
                
                Decryption Required:
                • Widevine license extraction required
                • Hardware security module (HSM) needed
                • Custom decryption bridge required
                • Estimated processing time: 12-24 hours
                
                Capture Info:
                • Target: {selectedScreenshot.targetName}
                • Time: {new Date(selectedScreenshot.timestamp).toLocaleString()}
                • Format: HEIC (Encrypted)
                • Resolution: 1920x1080
                • Session ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}
              </div>
              <div className="caution-warning">
                ⚠️ WARNING: This capture contains forensic watermarking. Unauthorized distribution can be traced back to the operator.
              </div>
            </div>
            <div className="caution-footer">
              <button className="btn btn-secondary" onClick={() => setShowCaution(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={requestDecryption}>Request Decryption</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};