import React, { useState, useEffect } from 'react';
import './CameraPanel.css';

interface Capture {
  id: number;
  targetName: string;
  timestamp: Date;
  type: string;
}

export const CameraPanel: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [cameraMode, setCameraMode] = useState<'front' | 'rear'>('front');
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [showCaution, setShowCaution] = useState(false);
  const [selectedCapture, setSelectedCapture] = useState<Capture | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        const newCapture = {
          id: Date.now(),
          targetName: 'Leila Nazari',
          timestamp: new Date(),
          type: cameraMode
        };
        setCaptures(prev => [newCapture, ...prev].slice(0, 12));
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isActive, cameraMode]);
  
  const handleViewCapture = (capture: Capture) => {
    setSelectedCapture(capture);
    setShowCaution(true);
  };
  
  const requestDecryption = () => {
    alert('🔐 Image decryption request submitted.\n\n' +
          'Estimated processing time: 2-4 hours.\n' +
          'You will be notified when decryption is complete.\n\n' +
          'Request ID: ' + Math.random().toString(36).substring(2, 15).toUpperCase());
    setShowCaution(false);
  };
  
  return (
    <div className="camera-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📸</span> Camera Control
          </div>
          <div className="panel-subtitle">Remote camera activation & photo capture</div>
        </div>
      </div>
      <div className="scroll-content">
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Live View — Leila Nazari</div>
              <div className={`live-indicator ${isActive ? 'active' : ''}`}>
                <div className="live-dot"></div>
                {isActive ? 'LIVE' : 'OFFLINE'}
              </div>
            </div>
            <div className="camera-feed">
              <div className="feed-overlay">
                <div className="camera-placeholder">
                  {cameraMode === 'front' ? '📱 Front Camera' : '📷 Rear Camera'}
                </div>
                {isActive && (
                  <div className="capture-indicator">
                    Capturing every 8 seconds...
                  </div>
                )}
              </div>
            </div>
            <div className="camera-controls">
              <button 
                className="control-btn"
                onClick={() => setCameraMode(cameraMode === 'front' ? 'rear' : 'front')}
              >
                🔄 Switch to {cameraMode === 'front' ? 'Rear' : 'Front'}
              </button>
              <button className="control-btn primary" onClick={() => setIsActive(!isActive)}>
                {isActive ? '⏹ Stop' : '📸 Activate'}
              </button>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="card-title">Camera Configuration</div>
            </div>
            <div className="form-row">
              <label className="form-label">Target</label>
              <select className="form-select">
                <option>Leila Nazari (Samsung S23)</option>
                <option>Ahmad Karimi (iPhone 14 Pro)</option>
                <option>Marcus Webb (iPhone 13)</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Camera</label>
              <select className="form-select" value={cameraMode} onChange={(e) => setCameraMode(e.target.value as 'front' | 'rear')}>
                <option value="front">Front Camera</option>
                <option value="rear">Rear Camera</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Mode</label>
              <select className="form-select">
                <option>Live Stream</option>
                <option>Timed Burst (every 5min)</option>
                <option>Motion Trigger</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setIsActive(true)}>
              📸 Activate Camera
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Captured Images Archive</div>
            <span className="archive-count">{captures.length} captures</span>
          </div>
          <div className="capture-grid">
            {captures.map((capture) => (
              <div key={capture.id} className="capture-item" onClick={() => handleViewCapture(capture)}>
                <div className="capture-preview">
                  {cameraMode === 'front' ? '🤳' : '📷'}
                  <div className="encryption-overlay">🔒</div>
                </div>
                <div className="capture-time">{new Date(capture.timestamp).toLocaleTimeString()}</div>
                <div className="capture-badge">HEIC Encrypted</div>
              </div>
            ))}
          </div>
          {captures.length === 0 && (
            <div className="no-captures">
              <div className="no-captures-icon">📸</div>
              <div>No captures yet. Activate camera to start capturing.</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Caution Modal */}
      {showCaution && selectedCapture && (
        <div className="modal-overlay" onClick={() => setShowCaution(false)}>
          <div className="caution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="caution-header">
              <div className="caution-icon">📸</div>
              <div className="caution-title">ENCRYPTED IMAGE CAPTURE</div>
              <button className="caution-close" onClick={() => setShowCaution(false)}>✕</button>
            </div>
            <div className="caution-body">
              <div className="caution-message">
                This image capture is protected with device-level encryption and cannot be viewed directly.
                
                Encryption Details:
                • Protocol: Apple FileVault 2 / Android FBE
                • Format: HEIC (Encrypted)
                • Key Storage: Secure Enclave / TEE
                
                Technical Analysis:
                • Image was captured via remote camera activation
                • HEIC to JPEG conversion requires decryption first
                • EXIF data contains device fingerprinting
                • Steganographic analysis may reveal hidden data
                
                Decryption Required:
                • iOS/macOS Keychain extraction required
                • FileVault recovery key needed
                • Estimated processing time: 2-3 hours
                
                Capture Info:
                • Target: {selectedCapture.targetName}
                • Time: {new Date(selectedCapture.timestamp).toLocaleString()}
                • Camera: {selectedCapture.type === 'front' ? 'Front' : 'Rear'}
                • Resolution: {Math.floor(Math.random() * 2000 + 1000)}x{Math.floor(Math.random() * 1500 + 800)}
                • Key ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
              <div className="caution-warning">
                ⚠️ WARNING: Unauthorized decryption attempts may trigger anti-forensic countermeasures and could alert the target device.
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