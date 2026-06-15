import React, { useState } from 'react';
import { useContactStore } from '@/stores/contactStore';
import './ContactsPanel.css';

export const ContactsPanel: React.FC = () => {
  const { contacts, getContactsByTarget } = useContactStore();
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  
  const targets = [...new Set(contacts.map(c => ({ id: c.targetId, name: c.targetName })))];
  const displayContacts = selectedTarget ? getContactsByTarget(selectedTarget) : contacts.slice(0, 20);
  
  const getFrequencyLabel = (count: number) => {
    if (count > 50) return 'Very High';
    if (count > 20) return 'High';
    if (count > 10) return 'Medium';
    return 'Low';
  };
  
  return (
    <div className="contacts-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">👥</span> Contacts
          </div>
          <div className="panel-subtitle">Extracted address books & social graph</div>
        </div>
      </div>
      <div className="two-pane">
        <div className="left-pane">
          <div className="target-selector">
            <div className="selector-title">Select Target</div>
            {targets.map(target => (
              <div
                key={target.id}
                className={`target-option ${selectedTarget === target.id ? 'active' : ''}`}
                onClick={() => setSelectedTarget(target.id)}
              >
                {target.name}
              </div>
            ))}
          </div>
        </div>
        <div className="right-pane">
          <div className="contacts-header">
            <div className="contacts-count">{displayContacts.length} contacts</div>
          </div>
          <div className="contacts-list">
            {displayContacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-details">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-info">
                    {contact.phoneNumbers[0] && (
                      <span className="contact-phone">{contact.phoneNumbers[0]}</span>
                    )}
                    {contact.emails[0] && (
                      <span className="contact-email">{contact.emails[0]}</span>
                    )}
                  </div>
                </div>
                <div className="contact-stats">
                  <div className="interaction-count">{contact.interactionCount} interactions</div>
                  <div className={`frequency-badge ${contact.isFrequent ? 'frequent' : ''}`}>
                    {getFrequencyLabel(contact.interactionCount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};