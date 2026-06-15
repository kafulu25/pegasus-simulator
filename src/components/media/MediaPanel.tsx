import React, { useState } from 'react';
import { useMediaStore } from '@/stores/mediaStore';
import './MediaPanel.css';

interface MediaItem {
  id: number;
  targetId: number;
  targetName: string;
  type: 'photo' | 'video' | 'document' | 'screenshot';
  filename: string;
  thumbnail?: string;
  size: number;
  timestamp: Date;
  source: 'camera' | 'gallery' | 'downloads' | 'screenshot';
}

export const MediaPanel: React.FC = () => {
  const { photos, documents, screenshots } = useMediaStore();
  const [view, setView] = useState<'photos' | 'documents' | 'screenshots'>('photos');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [cautionMessage, setCautionMessage] = useState<{ title: string; message: string; type: string } | null>(null);
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getCautionForMedia = (media: MediaItem) => {
    const cautionTypes = {
      photo: {
        title: '🔐 END-TO-END ENCRYPTION DETECTED',
        message: 'This media file is protected by AES-256 encryption. Requires Signal Protocol v3 decryption module. Third-party decryption software needed. Please contact your administrator for the decryption key.',
        icon: '📸'
      },
      video: {
        title: '⚠️ PROPIETARY CODEC ENCRYPTION',
        message: 'This video file is encoded with proprietary codec and encrypted with TLS 1.3. Decryption requires specialized forensic tools (FTK Imager v7.2+). The file may contain steganographic data that requires additional analysis.',
        icon: '🎥'
      },
      document: {
        title: '📄 DOCUMENT PROTECTION ACTIVE',
        message: 'This document is protected with DRM and 256-bit AES encryption. Microsoft Rights Management Services detected. Extraction requires RMS credential harvesting and custom decryption bridge.',
        icon: '📄'
      },
      screenshot: {
        title: '🖥️ SCREEN CAPTURE WATERMARKED',
        message: 'This screenshot contains forensic watermarking. Original device signature embedded. Extraction requires removing the digital signature using specialized software (Forensic Toolkit 8.0+).',
        icon: '🖥️'
      }
    };
    
    const randomErrors = [
      'Decryption key not found in local keystore. Please sync with C2 server.',
      'The file appears to be corrupted or intentionally obfuscated.',
      'Signal Protocol v4 encryption detected - requires updated decryption module.',
      'File contains anti-forensic markers. Handle with extreme caution.',
      'Possible honeypot detection - verify source integrity before proceeding.',
      'Metadata indicates the file was deleted and partially overwritten.',
      'Quantum encryption detected - requires specialized decryption hardware.',
    ];
    
    const baseCaution = cautionTypes[media.type];
    const randomError = randomErrors[Math.floor(Math.random() * randomErrors.length)];
    
    return {
      ...baseCaution,
      additionalError: randomError,
      timestamp: new Date().toISOString()
    };
  };
  
  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    const caution = getCautionForMedia(media);
    setCautionMessage({
      title: caution.title,
      message: `${caution.message}\n\n⚠️ ADDITIONAL INFORMATION: ${caution.additionalError}\n\n📅 Detection Timestamp: ${new Date().toLocaleString()}\n🔑 Request ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}\n🛡️ Security Level: MAXIMUM`,
      type: media.type
    });
  };
  
  const closeCaution = () => {
    setCautionMessage(null);
    setSelectedMedia(null);
  };
  
  const requestDecryption = () => {
    alert('🔐 Decryption request submitted to administrator.\n\nEstimated wait time: 24-48 hours.\nYou will be notified when the decryption key is available.\n\nRequest ID: ' + Math.random().toString(36).substring(2, 15).toUpperCase());
    closeCaution();
  };
  
  return (
    <div className="media-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📷</span> Media Gallery
          </div>
          <div className="panel-subtitle">Extracted photos, videos, and documents</div>
        </div>
        <div className="media-stats">
          <span className="stat-chip">📷 {photos.length} photos</span>
          <span className="stat-chip">📄 {documents.length} docs</span>
          <span className="stat-chip">🖥️ {screenshots.length} screenshots</span>
        </div>
      </div>
      
      <div className="media-tabs">
        <button className={`tab-btn ${view === 'photos' ? 'active' : ''}`} onClick={() => setView('photos')}>
          📸 Photos ({photos.length})
        </button>
        <button className={`tab-btn ${view === 'documents' ? 'active' : ''}`} onClick={() => setView('documents')}>
          📄 Documents ({documents.length})
        </button>
        <button className={`tab-btn ${view === 'screenshots' ? 'active' : ''}`} onClick={() => setView('screenshots')}>
          🖥️ Screenshots ({screenshots.length})
        </button>
      </div>
      
      <div className="scroll-content">
        {view === 'photos' && (
          <div className="photo-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-item" onClick={() => handleMediaClick(photo)}>
                <div className="photo-preview">{photo.thumbnail || '🌄'}</div>
                <div className="photo-info">
                  <div className="photo-name">{photo.filename}</div>
                  <div className="photo-meta">{formatSize(photo.size)}</div>
                  <div className="encryption-badge">🔒 Encrypted</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {view === 'documents' && (
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="doc-item" onClick={() => handleMediaClick(doc)}>
                <div className="doc-icon">📄</div>
                <div className="doc-info">
                  <div className="doc-name">{doc.filename}</div>
                  <div className="doc-meta">
                    <span>{formatSize(doc.size)}</span>
                    <span>•</span>
                    <span>{doc.targetName}</span>
                    <span>•</span>
                    <span className="encrypted-tag">AES-256 Encrypted</span>
                  </div>
                </div>
                <button className="download-btn" onClick={(e) => { e.stopPropagation(); alert('Download requires decryption first. Please view file to request decryption.'); }}>⬇ Download</button>
              </div>
            ))}
          </div>
        )}
        
        {view === 'screenshots' && (
          <div className="screenshot-grid">
            {screenshots.map((screenshot) => (
              <div key={screenshot.id} className="screenshot-item" onClick={() => handleMediaClick(screenshot)}>
                <div className="screenshot-preview">🖥️</div>
                <div className="screenshot-info">
                  <div className="screenshot-name">{screenshot.filename}</div>
                  <div className="screenshot-date">{new Date(screenshot.timestamp).toLocaleString()}</div>
                  <div className="watermark-badge">🔏 Watermarked</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Caution Modal */}
      {cautionMessage && (
        <div className="modal-overlay" onClick={closeCaution}>
          <div className="caution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="caution-header">
              <div className="caution-icon">⚠️</div>
              <div className="caution-title">{cautionMessage.title}</div>
              <button className="caution-close" onClick={closeCaution}>✕</button>
            </div>
            <div className="caution-body">
              <div className="caution-message">{cautionMessage.message}</div>
              <div className="caution-details">
                <div className="detail-row">
                  <span className="detail-label">File Type:</span>
                  <span className="detail-value">{cautionMessage.type.toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Encryption:</span>
                  <span className="detail-value">AES-256 / TLS 1.3</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Security Level:</span>
                  <span className="detail-value critical">CRITICAL</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Required Software:</span>
                  <span className="detail-value">Signal Protocol Decoder v3.2+</span>
                </div>
              </div>
              <div className="caution-warning">
                <strong>⚠️ WARNING:</strong> Unauthorized decryption attempts may trigger anti-forensic countermeasures and could alert the target.
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