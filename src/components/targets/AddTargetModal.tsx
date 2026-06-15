import React, { useState, useRef, useEffect } from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { Target } from '@/types';
import './AddTargetModal.css';

interface AddTargetModalProps {
  onClose: () => void;
}

export const AddTargetModal: React.FC<AddTargetModalProps> = ({ onClose }) => {
  const { addTarget } = useTargetStore();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    os: 'iOS' as 'iOS' | 'Android',
    device: '',
    country: '',
  });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Focus first input on mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter target name');
      return;
    }
    
    const newTarget: Target = {
      id: Date.now(),
      name: formData.name,
      role: formData.role || 'Unknown',
      avatar: formData.name.slice(0, 2).toUpperCase(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      status: 'active',
      os: formData.os,
      device: formData.device || (formData.os === 'iOS' ? 'iPhone' : 'Android Device'),
      country: formData.country || 'Unknown',
      infectedSince: new Date().toISOString().split('T')[0],
      agentVersion: 'v4.2.2',
    };
    
    addTarget(newTarget);
    onClose();
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-target-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">➕ Add New Target</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <label className="form-label">Full Name *</label>
              <input
                ref={firstInputRef}
                type="text"
                className="form-input"
                required
                placeholder="Enter target's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Role / Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Journalist, Activist, Politician"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 555 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="target@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Device OS</label>
              <select
                className="form-select"
                value={formData.os}
                onChange={(e) => setFormData({ ...formData, os: e.target.value as 'iOS' | 'Android' })}
              >
                <option value="iOS">iOS (iPhone/iPad)</option>
                <option value="Android">Android</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Device Model</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., iPhone 14 Pro, Samsung S23"
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-input"
                placeholder="Country of operation"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Deploy Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};