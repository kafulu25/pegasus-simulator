import React, { useState } from 'react';
import { useVoiceNotesStore } from '../../stores/voiceNotesStore';
import './VoiceNotesPanel.css';

export const VoiceNotesPanel: React.FC = () => {
  const {
    services,
    currentPage,
    pageSize,
    targetPhone,
    batchMapping,
    selectedService,
    totalServices,
    setTargetPhone,
    setBatchMapping,
    randomizeMapping,
    setPage,
    selectService,
    setTotalServices,
    reset,
  } = useVoiceNotesStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchInput, setBatchInput] = useState(() => {
    // For display, we show numbers from mapping (if any), but we want to show raw numbers for editing?
    // We'll just show the numbers that are currently mapped, but we need a list of unique numbers.
    const numbers = Object.values(batchMapping);
    return numbers.join('\n');
  });
  const [tempPhone, setTempPhone] = useState(targetPhone);
  const [editingTotal, setEditingTotal] = useState(false);
  const [tempTotal, setTempTotal] = useState(totalServices);

  const totalPages = Math.ceil(services.length / pageSize);
  const currentServices = services.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleBatchSave = () => {
    const lines = batchInput.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return;
    // Randomly assign numbers to services
    randomizeMapping(lines);
    alert('✅ Batch numbers mapped randomly to services!');
  };

  const handleTargetPhoneSave = () => {
    setTargetPhone(tempPhone);
    alert('✅ Target phone number saved!');
  };

  const handleTotalSave = () => {
    if (tempTotal > 0) {
      setTotalServices(tempTotal);
      setEditingTotal(false);
    }
  };

  const openModal = (service: VoiceService) => {
    selectService(service);
  };

  const closeModal = () => {
    selectService(null);
  };

  return (
    <div className="voice-notes-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🎙️</span> Voice Notes Services
            {targetPhone && <span className="target-phone"> — Target: {targetPhone}</span>}
          </div>
          <div className="panel-subtitle">
            <span
              onDoubleClick={() => { setEditingTotal(true); setTempTotal(totalServices); }}
              style={{ cursor: 'pointer', borderBottom: '1px dashed var(--border)' }}
              title="Double‑click to edit"
            >
              {totalServices}
            </span>
            {editingTotal ? (
              <>
                <input
                  type="number"
                  value={tempTotal}
                  onChange={(e) => setTempTotal(parseInt(e.target.value) || 0)}
                  className="edit-total-input"
                  autoFocus
                />
                <button className="btn-save-total" onClick={handleTotalSave}>Save</button>
                <button className="btn-cancel-total" onClick={() => setEditingTotal(false)}>Cancel</button>
              </>
            ) : (
              <span> voice note services from social media platforms</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '🔒 Hide Advanced' : '🔓 Show Advanced'}
          </button>
          <button className="btn-reset" onClick={reset}>
            🔄 Reset Data
          </button>
        </div>
      </div>

      {/* Advanced section – hidden by default */}
      {showAdvanced && (
        <div className="advanced-section">
          <div className="advanced-card">
            <div className="advanced-title">📞 Target Phone Number</div>
            <div className="advanced-row">
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="Enter target phone number"
                className="advanced-input"
              />
              <button className="btn-save-advanced" onClick={handleTargetPhoneSave}>
                💾 Save Target
              </button>
            </div>
            <div className="advanced-hint">
              This number will be displayed in the header and associated with all mapped voice services.
            </div>
          </div>

          <div className="advanced-card">
            <div className="advanced-title">📋 Batch Number Mapping</div>
            <div className="advanced-row">
              <textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="+256703675421&#10;+256772674589&#10;+447911123456"
                className="advanced-textarea"
                rows={6}
              />
            </div>
            <div className="advanced-row">
              <button className="btn-save-advanced" onClick={handleBatchSave}>
                🔀 Randomize Mapping
              </button>
            </div>
            <div className="advanced-hint">
              Paste a list of phone numbers (one per line). Each voice note service will be randomly assigned one of these numbers.
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="services-list">
        <div className="list-header">
          <span className="list-counter">
            Showing {currentPage * pageSize + 1} – {Math.min((currentPage + 1) * pageSize, services.length)} of {services.length}
          </span>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ◀ Prev
            </button>
            <span className="page-info">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={currentPage >= totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next ▶
            </button>
          </div>
        </div>

        <div className="services-grid">
          {currentServices.map((service) => (
            <div
              key={service.id}
              className="service-item"
              onClick={() => openModal(service)}
            >
              <span className="service-icon">{service.icon}</span>
              <div className="service-info">
                <div className="service-name">{service.name}</div>
                <div className="service-platform">{service.platform}</div>
              </div>
              <div className="service-badge">
                {service.encryption}
                {service.keyRequired && <span className="key-required">🔑</span>}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-bottom">
            <button
              className="page-btn"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(0)}
            >
              ◀◀ First
            </button>
            <button
              className="page-btn"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ◀ Prev
            </button>
            <span className="page-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={currentPage >= totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next ▶
            </button>
            <button
              className="page-btn"
              disabled={currentPage >= totalPages - 1}
              onClick={() => handlePageChange(totalPages - 1)}
            >
              Last ▶▶
            </button>
          </div>
        )}
      </div>

      {/* Caution Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                ⚠️ High‑Security Encryption Detected
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="caution-icon">🔐</div>
              <div className="caution-title">
                {selectedService.platform} – {selectedService.name}
              </div>
              <div className="caution-details">
                <p><strong>Encryption:</strong> {selectedService.encryption}</p>
                <p><strong>Key Required:</strong> {selectedService.keyRequired ? 'Yes' : 'No'}</p>
                <p><strong>Service ID:</strong> {selectedService.id}</p>
                {batchMapping[selectedService.id] && (
                  <p><strong>Mapped Number:</strong> {batchMapping[selectedService.id]}</p>
                )}
                {targetPhone && (
                  <p><strong>Target Phone:</strong> {targetPhone}</p>
                )}
              </div>
              <div className="caution-message">
                <p className="caution-warning">
                  ⚡ This service uses {selectedService.encryption} encryption.
                </p>
                <p className="caution-detail">
                  • End‑to‑End encryption requires the recipient’s public key.
                </p>
                <p className="caution-detail">
                  • Transport‑layer encryption protects data in transit, but the server may have access to the keys.
                </p>
                <p className="caution-detail">
                  • No encryption means voice notes are transmitted in plaintext.
                </p>
                <p className="caution-detail">
                  • To intercept this service, the encryption keys must be obtained from the device or the key exchange protocol.
                </p>
                <p className="caution-detail">
                  • Advanced decryption may require side‑channel analysis or hardware attacks.
                </p>
                <p className="caution-recommend">
                  💡 Recommendation: Use a zero‑day exploit or social engineering to capture the session keys.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
