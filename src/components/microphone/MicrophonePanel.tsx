import React, { useState, useEffect } from 'react';
import { useMicrophoneStore } from '@/stores/microphoneStore';
import './MicrophonePanel.css';

export const MicrophonePanel: React.FC = () => {
  const { isRecording, duration, recordings, startRecording, stopRecording } = useMicrophoneStore();
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(40).fill(10));
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [showCaution, setShowCaution] = useState(false);
  const [cautionMessage, setCautionMessage] = useState<any>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformValues(Array(40).fill(0).map(() => Math.random() * 40 + 10));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);
  
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  const handlePlayRecording = (recording: any) => {
    setSelectedRecording(recording);
    setCautionMessage({
      title: '🔐 ENCRYPTED AUDIO DETECTED',
      message: `This recording (${recording.targetName} - ${new Date(recording.timestamp).toLocaleString()}) is protected with end-to-end encryption.\n\n` +
               `Encryption Protocol: Signal Protocol v3 / AES-256\n` +
               `Key Exchange: X3DH (Extended Triple Diffie-Hellman)\n` +
               `Audio Codec: OPUS (Encrypted)\n\n` +
               `⚠️ Technical Analysis:\n` +
               `• The audio stream was intercepted during an encrypted call\n` +
               `• ML-KEM-768 post-quantum encryption detected\n` +
               `• Session keys are rotated every 60 seconds\n` +
               `• Ephemeral key retrieval required from C2 server\n\n` +
               `🔑 Decryption Required:\n` +
               `• Signal Protocol Decoder v3.2+ is required\n` +
               `• Session key extraction may take 4-6 hours\n` +
               `• Success rate: 67% for encrypted calls\n\n` +
               `📅 Intercepted: ${new Date(recording.timestamp).toLocaleString()}\n` +
               `📊 File Size: ${(recording.size / (1024 * 1024)).toFixed(1)} MB\n` +
               `🆔 Session ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      type: 'audio'
    });
    setShowCaution(true);
  };
  
  const handleViewCapture = (capture: any, type: string) => {
    setSelectedRecording(capture);
    const messages = {
      camera: {
        title: '📸 ENCRYPTED IMAGE CAPTURE',
        message: `This image capture (${capture.targetName} - ${new Date(capture.timestamp).toLocaleString()}) is protected with device-level encryption.\n\n` +
                 `Encryption Protocol: Apple FileVault 2 / Android FBE\n` +
                 `Image Format: HEIC (Encrypted)\n` +
                 `Metadata: Stripped (Anti-forensic measures detected)\n\n` +
                 `⚠️ Technical Analysis:\n` +
                 `• Image was captured via remote camera activation\n` +
                 `• HEIC to JPEG conversion requires decryption first\n` +
                 `• EXIF data contains device fingerprinting\n` +
                 `• Steganographic analysis may reveal hidden data\n\n` +
                 `🔑 Decryption Required:\n` +
                 `• iOS/macOS Keychain extraction required\n` +
                 `• FileVault recovery key needed\n` +
                 `• Estimated processing time: 2-3 hours\n\n` +
                 `📅 Captured: ${new Date(capture.timestamp).toLocaleString()}\n` +
                 `🖼️ Resolution: ${Math.floor(Math.random() * 2000 + 1000)}x${Math.floor(Math.random() * 1500 + 800)}\n` +
                 `🔑 Key ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      },
      screen: {
        title: '🖥️ ENCRYPTED SCREEN CAPTURE',
        message: `This screen capture (${capture.targetName} - ${new Date(capture.timestamp).toLocaleString()}) is protected with DRM and hardware-based encryption.\n\n` +
                 `Encryption Protocol: HDCP 2.2 / Widevine L1\n` +
                 `Capture Method: Hardware frame buffer extraction\n` +
                 `Watermark: Digital forensic watermark embedded\n\n` +
                 `⚠️ Technical Analysis:\n` +
                 `• Screen capture bypassed HDCP protection\n` +
                 `• Forensic watermark contains: Device ID, Timestamp, Operator ID\n` +
                 `• Modified JPEG headers detected\n` +
                 `• Pixel obfuscation algorithm identified\n\n` +
                 `🔑 Decryption Required:\n` +
                 `• Widevine license extraction required\n` +
                 `• Hardware security module (HSM) needed\n` +
                 `• Estimated processing time: 12-24 hours\n\n` +
                 `📅 Captured: ${new Date(capture.timestamp).toLocaleString()}\n` +
                 `📐 Resolution: ${Math.floor(Math.random() * 2500 + 1920)}x${Math.floor(Math.random() * 1500 + 1080)}\n` +
                 `🎯 Target Device: ${capture.targetName}`
      }
    };
    
    setCautionMessage(messages[type as keyof typeof messages] || messages.camera);
    setShowCaution(true);
  };
  
  const requestDecryption = () => {
    alert('🔐 Decryption request submitted to forensic team.\n\n' +
          'Estimated processing time: 24-72 hours.\n' +
          'You will be notified when decryption is complete.\n\n' +
          'Request ID: ' + Math.random().toString(36).substring(2, 15).toUpperCase());
    setShowCaution(false);
    setSelectedRecording(null);
  };
  
  const closeCaution = () => {
    setShowCaution(false);
    setSelectedRecording(null);
  };
  
  return (
    <div className="microphone-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🎙️</span> Microphone Control
          </div>
          <div className="panel-subtitle">Ambient listening & call recording</div>
        </div>
      </div>
      <div className="scroll-content">
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Active Session — Ahmad Karimi</div>
              <div className={`recording-status ${isRecording ? 'active' : ''}`}>
                <div className="recording-dot"></div>
                {isRecording ? 'RECORDING' : 'STANDBY'}
              </div>
            </div>
            <div className="waveform-container">
              <div className="waveform">
                {waveformValues.map((height, i) => (
                  <div
                    key={i}
                    className="wave-bar"
                    style={{ height: `${height}px`, animationDelay: `${i * 0.02}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="recording-info">
              <div className="info-row">
                <span>Duration:</span>
                <span className="duration-value">{formatDuration(duration)}</span>
              </div>
              <div className="info-row">
                <span>Quality:</span>
                <span className="quality-value">48kHz · 192kbps</span>
              </div>
              <div className="info-row">
                <span>Encryption:</span>
                <span className="encryption-value">AES-256 (Real-time)</span>
              </div>
            </div>
            <div className="action-buttons">
              {!isRecording ? (
                <button className="btn btn-primary" onClick={startRecording}>
                  🎙 Start Recording
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopRecording}>
                  ⏹ Stop Recording
                </button>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="card-title">Start New Session</div>
            </div>
            <div className="form-row">
              <label className="form-label">Select Target</label>
              <select className="form-select">
                <option>Ahmad Karimi (iPhone 14 Pro)</option>
                <option>Leila Nazari (Samsung S23)</option>
                <option>Marcus Webb (iPhone 13)</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Mode</label>
              <select className="form-select">
                <option>Ambient Listening</option>
                <option>Call Interception</option>
                <option>Timed Recording (5min)</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={startRecording}>🎙 Activate Microphone</button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recording Archive</div>
            <span className="archive-count">{recordings.length} recordings</span>
          </div>
          <table className="recordings-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Size</th>
                <th>Encryption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.targetName}</td>
                  <td>{new Date(rec.timestamp).toLocaleString()}</td>
                  <td>{formatDuration(rec.duration)}</td>
                  <td><span className="type-badge">{rec.type}</span></td>
                  <td>{(rec.size / (1024 * 1024)).toFixed(1)} MB</td>
                  <td><span className="encrypted-badge">🔒 AES-256</span></td>
                  <td>
                    <button className="action-icon" onClick={() => handlePlayRecording(rec)} title="Play Recording">▶</button>
                    <button className="action-icon" title="Download">⬇</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Caution Modal */}
      {showCaution && cautionMessage && (
        <div className="modal-overlay" onClick={closeCaution}>
          <div className="caution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="caution-header">
              <div className="caution-icon">⚠️</div>
              <div className="caution-title">{cautionMessage.title}</div>
              <button className="caution-close" onClick={closeCaution}>✕</button>
            </div>
            <div className="caution-body">
              <div className="caution-message" style={{ whiteSpace: 'pre-line' }}>{cautionMessage.message}</div>
              <div className="caution-warning">
                <strong>⚠️ SECURITY NOTICE:</strong> Unauthorized decryption attempts may trigger anti-forensic countermeasures and could alert the target device.
              </div>
            </div>
            <div className="caution-footer">
              <button className="btn btn-secondary" onClick={closeCaution}>Cancel</button>
              <button className="btn btn-primary" onClick={requestDecryption}>Request Decryption</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};