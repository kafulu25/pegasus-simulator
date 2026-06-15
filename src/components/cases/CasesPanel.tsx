import React, { useState } from 'react';
import { useCaseStore } from '@/stores/caseStore';
import './CasesPanel.css';

export const CasesPanel: React.FC = () => {
  const { cases, addCase, updateCase, removeCase } = useCaseStore();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'pending' | 'closed',
    priority: 'medium' as 'high' | 'medium' | 'low',
    targets: '',
    evidenceCount: 0
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'pending': return '🟡';
      case 'closed': return '🔴';
      default: return '⚪';
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="priority-badge high">HIGH</span>;
      case 'medium': return <span className="priority-badge medium">MEDIUM</span>;
      case 'low': return <span className="priority-badge low">LOW</span>;
      default: return null;
    }
  };
  
  const handleAddCase = () => {
    if (!newCaseForm.name.trim()) {
      alert('Please enter a case name');
      return;
    }
    
    const newCase = {
      id: Date.now(),
      name: newCaseForm.name,
      description: newCaseForm.description || 'No description provided',
      status: newCaseForm.status,
      priority: newCaseForm.priority,
      targets: newCaseForm.targets.split(',').map(t => t.trim()).filter(t => t),
      createdDate: new Date(),
      lastUpdated: new Date(),
      evidenceCount: newCaseForm.evidenceCount || 0,
    };
    
    addCase(newCase);
    setShowNewCaseModal(false);
    setNewCaseForm({
      name: '',
      description: '',
      status: 'active',
      priority: 'medium',
      targets: '',
      evidenceCount: 0
    });
  };
  
  const handleStatusChange = (caseId: number, newStatus: 'active' | 'pending' | 'closed') => {
    updateCase(caseId, { status: newStatus });
  };
  
  return (
    <div className="cases-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📋</span> Case Management
          </div>
          <div className="panel-subtitle">Manage surveillance operations and investigations</div>
        </div>
        <button className="btn-new-case" onClick={() => setShowNewCaseModal(true)}>
          + New Case
        </button>
      </div>
      
      <div className="cases-stats">
        <div className="stat-card">
          <div className="stat-value">{cases.filter(c => c.status === 'active').length}</div>
          <div className="stat-label">Active Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cases.reduce((sum, c) => sum + c.evidenceCount, 0).toLocaleString()}</div>
          <div className="stat-label">Total Evidence Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(cases.flatMap(c => c.targets)).size}</div>
          <div className="stat-label">Unique Targets</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cases.filter(c => c.priority === 'high').length}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>
      
      <div className="scroll-content">
        <div className="cases-grid">
          {cases.map(caseItem => (
            <div key={caseItem.id} className={`case-card ${caseItem.status}`} onClick={() => setSelectedCase(caseItem)}>
              <div className="case-header">
                <div className="case-name">
                  <span className="case-icon">📁</span>
                  {caseItem.name}
                </div>
                <div className="case-status">
                  {getStatusIcon(caseItem.status)} {caseItem.status.toUpperCase()}
                </div>
              </div>
              <div className="case-description">{caseItem.description}</div>
              <div className="case-meta">
                <div className="meta-item">
                  <span className="meta-label">Priority:</span>
                  {getPriorityBadge(caseItem.priority)}
                </div>
                <div className="meta-item">
                  <span className="meta-label">Targets:</span>
                  <span className="meta-value">{caseItem.targets.join(', ')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Evidence:</span>
                  <span className="meta-value">{caseItem.evidenceCount.toLocaleString()} items</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Last Updated:</span>
                  <span className="meta-value">{new Date(caseItem.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="case-actions">
                <button className="btn-ghost-small" onClick={(e) => { e.stopPropagation(); setSelectedCase(caseItem); }}>View Details</button>
                <select 
                  className="status-select" 
                  value={caseItem.status}
                  onChange={(e) => { e.stopPropagation(); handleStatusChange(caseItem.id, e.target.value as any); }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="modal-overlay" onClick={() => setShowNewCaseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">➕ Create New Case</div>
              <button className="modal-close" onClick={() => setShowNewCaseModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleAddCase(); }}>
                <div className="form-row">
                  <label className="form-label">Case Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., Operation Nightfall"
                    value={newCaseForm.name}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    placeholder="Case description..."
                    value={newCaseForm.description}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  />
                </div>
                <div className="form-row two-columns">
                  <div>
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={newCaseForm.status}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, status: e.target.value as any })}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select"
                      value={newCaseForm.priority}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, priority: e.target.value as any })}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <label className="form-label">Targets (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., Ahmad Karimi, Leila Nazari"
                    value={newCaseForm.targets}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, targets: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label className="form-label">Initial Evidence Count</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0"
                    value={newCaseForm.evidenceCount}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, evidenceCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowNewCaseModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Case</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Case Details Modal */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{selectedCase.name} - Case Details</div>
              <button className="modal-close" onClick={() => setSelectedCase(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="case-detail-section">
                <h4>Case Information</h4>
                <p><strong>Description:</strong> {selectedCase.description}</p>
                <p><strong>Status:</strong> {selectedCase.status}</p>
                <p><strong>Priority:</strong> {selectedCase.priority}</p>
                <p><strong>Created:</strong> {new Date(selectedCase.createdDate).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedCase.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div className="case-detail-section">
                <h4>Associated Targets</h4>
                <div className="target-list">
                  {selectedCase.targets.map((target: string) => (
                    <div key={target} className="target-chip">{target}</div>
                  ))}
                </div>
              </div>
              <div className="case-detail-section">
                <h4>Evidence Summary</h4>
                <div className="evidence-stats">
                  <div>📊 Total Items: {selectedCase.evidenceCount.toLocaleString()}</div>
                  <div>💬 Messages: {Math.floor(selectedCase.evidenceCount * 0.4).toLocaleString()}</div>
                  <div>📞 Calls: {Math.floor(selectedCase.evidenceCount * 0.15).toLocaleString()}</div>
                  <div>📍 Locations: {Math.floor(selectedCase.evidenceCount * 0.2).toLocaleString()}</div>
                  <div>🔑 Credentials: {Math.floor(selectedCase.evidenceCount * 0.05).toLocaleString()}</div>
                </div>
              </div>
              <div className="info-note">
                💡 To edit case details, go to Settings → Simulation Data Editor → Case Management
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => {
                alert('Report generation started. You will be notified when ready.');
              }}>Generate Full Report</button>
              <button className="btn-danger" onClick={() => {
                if (confirm('Close this case?')) {
                  updateCase(selectedCase.id, { status: 'closed' });
                  setSelectedCase(null);
                }
              }}>Close Case</button>
              <button className="btn-ghost" onClick={() => setSelectedCase(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};