import React, { useState } from 'react';
import { useEmailStore } from '@/stores/emailStore';
import { format } from 'date-fns';
import './EmailPanel.css';

export const EmailPanel: React.FC = () => {
  const { emails, selectedEmailId, selectEmail, markAsRead } = useEmailStore();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedEmail = emails.find(e => e.id === selectedEmailId);
  
  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.targetName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectEmail = (id: number) => {
    selectEmail(id);
    markAsRead(id);
  };
  
  return (
    <div className="email-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📧</span> Email Interception
          </div>
          <div className="panel-subtitle">Gmail, Outlook, ProtonMail</div>
        </div>
        <button className="btn btn-primary">Export All</button>
      </div>
      <div className="two-pane">
        <div className="left-pane">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="email-list">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`email-item ${selectedEmailId === email.id ? 'active' : ''} ${!email.isRead ? 'unread' : ''}`}
                onClick={() => handleSelectEmail(email.id)}
              >
                <div className="email-sender">{email.from}</div>
                <div className="email-subject">{email.subject}</div>
                <div className="email-meta">
                  <span>{email.targetName}</span>
                  <span>•</span>
                  <span>{format(email.date, 'MMM dd, HH:mm')}</span>
                  {email.hasAttachments && <span className="attachment-icon">📎</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-pane">
          {selectedEmail ? (
            <div className="email-detail">
              <div className="email-detail-header">
                <div className="email-detail-subject">{selectedEmail.subject}</div>
                <div className="email-detail-meta">
                  <div><strong>From:</strong> {selectedEmail.from}</div>
                  <div><strong>To:</strong> {selectedEmail.to.join(', ')}</div>
                  <div><strong>Date:</strong> {format(selectedEmail.date, 'EEEE, MMMM dd, yyyy HH:mm')}</div>
                  <div><strong>Target:</strong> {selectedEmail.targetName}</div>
                </div>
              </div>
              <div className="email-detail-body">
                {selectedEmail.body.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {selectedEmail.hasAttachments && (
                <div className="email-attachments">
                  <div className="attachments-title">Attachments</div>
                  <button className="download-attachment-btn">⬇ Download Attachment</button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-email-selected">
              <div className="no-email-icon">📧</div>
              <div>Select an email to view contents</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};