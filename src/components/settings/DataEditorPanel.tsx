import React, { useState } from 'react';
import { useTargetStore } from '@/stores/targetStore';
import { useMessageStore } from '@/stores/messageStore';
import { useCallStore } from '@/stores/callStore';
import { useLocationStore } from '@/stores/locationStore';
import { useKeylogStore } from '@/stores/keylogStore';
import { useBrowserStore } from '@/stores/browserStore';
import { useContactStore } from '@/stores/contactStore';
import { useEmailStore } from '@/stores/emailStore';
import { usePasswordStore } from '@/stores/passwordStore';
import { useAlertStore } from '@/stores/alertStore';
import { useCaseStore } from '@/stores/caseStore';
import { useFeedStore } from '@/stores/feedStore';
import './DataEditorPanel.css';

// Sync feed events with current target names
const syncFeedEventsWithTargets = () => {
  const { events } = useFeedStore.getState();
  const { targets } = useTargetStore.getState();
  
  const updatedEvents = events.map(event => {
    const target = targets.find(t => t.id === event.targetId);
    if (target && target.name !== event.targetName) {
      return { ...event, targetName: target.name };
    }
    return event;
  });
  
  if (JSON.stringify(updatedEvents) !== JSON.stringify(events)) {
    useFeedStore.setState({ events: updatedEvents });
  }
};

type DataCategory = 'targets' | 'messages' | 'calls' | 'locations' | 'keylogs' | 'browser' | 'contacts' | 'emails' | 'passwords' | 'alerts' | 'cases' | 'feed';

export const DataEditorPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DataCategory>('targets');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [locationInputType, setLocationInputType] = useState<'coordinates' | 'ip'>('coordinates');
  
  // Get stores and their actions
  const { targets, addTarget, updateTarget, removeTarget } = useTargetStore();
  const { conversations, addConversation } = useMessageStore();
  const { calls, addCall } = useCallStore();
  const { locations, addLocation } = useLocationStore();
  const { entries, addEntry } = useKeylogStore();
  const { history, addHistory } = useBrowserStore();
  const { contacts, addContact } = useContactStore();
  const { emails, addEmail } = useEmailStore();
  const { credentials, addCredential } = usePasswordStore();
  const { alerts, addAlert } = useAlertStore();
  const { cases, addCase, updateCase, removeCase } = useCaseStore();
  const { events, addEvent } = useFeedStore();
  
  const categories = [
    { id: 'targets', name: '🎯 Targets', count: targets.length },
    { id: 'messages', name: '💬 Conversations', count: conversations.length },
    { id: 'calls', name: '📞 Call Logs', count: calls.length },
    { id: 'locations', name: '📍 Locations', count: locations.length },
    { id: 'keylogs', name: '⌨️ Keylogs', count: entries.length },
    { id: 'browser', name: '🌐 Browser History', count: history.length },
    { id: 'contacts', name: '👥 Contacts', count: contacts.length },
    { id: 'emails', name: '📧 Emails', count: emails.length },
    { id: 'passwords', name: '🔑 Passwords', count: credentials.length },
    { id: 'alerts', name: '🔔 Alerts', count: alerts.length },
    { id: 'cases', name: '📋 Case Management', count: cases.length },
    { id: 'feed', name: '🔄 Recent Activities', count: events.length },
  ];
  
  // Handle Edit
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowAddForm(true);
  };
  
  // Handle Save Edit
  const handleSaveEdit = () => {
    switch (selectedCategory) {
      case 'targets':
  // Store the old target name before updating
  const oldTarget = targets.find(t => t.id === formData.id);
  const oldName = oldTarget?.name;
  const newName = formData.name;
  
  // Update the target
  updateTarget(formData.id, formData);
  
  // If the name changed, update all feed events that reference this target
  if (oldName && oldName !== newName) {
    const { events } = useFeedStore.getState();
    const updatedEvents = events.map(event => 
      event.targetId === formData.id 
        ? { ...event, targetName: newName }
        : event
    );
    useFeedStore.setState({ events: updatedEvents });
    showToast(`✅ Target name updated from "${oldName}" to "${newName}" in all activities`);
  }
  break;
        
      case 'messages':
        const convIndex = conversations.findIndex(c => c.id === formData.id);
        if (convIndex !== -1) {
          const updatedConvs = [...conversations];
          updatedConvs[convIndex] = formData;
          useMessageStore.setState({ conversations: updatedConvs });
        }
        break;
        
      case 'locations':
        const locIndex = locations.findIndex(l => l.id === formData.id);
        if (locIndex !== -1) {
          const updatedLocs = [...locations];
          updatedLocs[locIndex] = formData;
          useLocationStore.setState({ locations: updatedLocs });
        }
        break;
        
      case 'keylogs':
        const keyIndex = entries.findIndex(e => e.id === formData.id);
        if (keyIndex !== -1) {
          const updatedKeys = [...entries];
          updatedKeys[keyIndex] = formData;
          useKeylogStore.setState({ entries: updatedKeys });
        }
        break;
        
      case 'passwords':
        const credIndex = credentials.findIndex(c => c.id === formData.id);
        if (credIndex !== -1) {
          const updatedCreds = [...credentials];
          updatedCreds[credIndex] = formData;
          usePasswordStore.setState({ credentials: updatedCreds });
        }
        break;
        
	      case 'calls':
  addCall({
    id: newId,
    targetId: 1,
    targetName: formData.targetName || 'Ahmad Karimi',
    direction: formData.direction || 'incoming',
    number: formData.number || '+1234567890',
    duration: formData.duration || 60,
    date: new Date(),
    hasRecording: true,
    app: formData.app || 'Cellular',
  });
  break;
        
      case 'contacts':
        const contactIndex = contacts.findIndex(c => c.id === formData.id);
        if (contactIndex !== -1) {
          const updatedContacts = [...contacts];
          updatedContacts[contactIndex] = formData;
          useContactStore.setState({ contacts: updatedContacts });
        }
        break;
        
      case 'emails':
        const emailIndex = emails.findIndex(e => e.id === formData.id);
        if (emailIndex !== -1) {
          const updatedEmails = [...emails];
          updatedEmails[emailIndex] = formData;
          useEmailStore.setState({ emails: updatedEmails });
        }
        break;
        
      case 'browser':
        const historyIndex = history.findIndex(h => h.id === formData.id);
        if (historyIndex !== -1) {
          const updatedHistory = [...history];
          updatedHistory[historyIndex] = formData;
          useBrowserStore.setState({ history: updatedHistory });
        }
        break;
        
      case 'alerts':
        const alertIndex = alerts.findIndex(a => a.id === formData.id);
        if (alertIndex !== -1) {
          const updatedAlerts = [...alerts];
          updatedAlerts[alertIndex] = formData;
          useAlertStore.setState({ alerts: updatedAlerts });
        }
        break;
		
      case 'cases':
        const caseIndex = cases.findIndex(c => c.id === formData.id);
        if (caseIndex !== -1) {
          const updatedCases = [...cases];
          updatedCases[caseIndex] = formData;
          useCaseStore.setState({ cases: updatedCases });
        }
        break;
      
      case 'feed':
        const eventIndex = events.findIndex(e => e.id === formData.id);
        if (eventIndex !== -1) {
          const updatedEvents = [...events];
          updatedEvents[eventIndex] = formData;
          useFeedStore.setState({ events: updatedEvents });
        }
        break;
    }
    
    showToast('✅ Item updated successfully!');
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({});
  };
  
  // Handle Delete
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      switch (selectedCategory) {
        case 'targets':
          removeTarget(id);
          break;
        case 'messages':
          const updatedConvs = conversations.filter(c => c.id !== id);
          useMessageStore.setState({ conversations: updatedConvs });
          break;
        case 'locations':
          const updatedLocs = locations.filter(l => l.id !== id);
          useLocationStore.setState({ locations: updatedLocs });
          break;
        case 'keylogs':
          const updatedKeys = entries.filter(e => e.id !== id);
          useKeylogStore.setState({ entries: updatedKeys });
          break;
        case 'passwords':
          const updatedCreds = credentials.filter(c => c.id !== id);
          usePasswordStore.setState({ credentials: updatedCreds });
          break;
        case 'calls':
          const updatedCalls = calls.filter(c => c.id !== id);
          useCallStore.setState({ calls: updatedCalls });
          break;
        case 'contacts':
          const updatedContacts = contacts.filter(c => c.id !== id);
          useContactStore.setState({ contacts: updatedContacts });
          break;
        case 'emails':
          const updatedEmails = emails.filter(e => e.id !== id);
          useEmailStore.setState({ emails: updatedEmails });
          break;
        case 'browser':
          const updatedHistory = history.filter(h => h.id !== id);
          useBrowserStore.setState({ history: updatedHistory });
          break;
        case 'alerts':
          const updatedAlerts = alerts.filter(a => a.id !== id);
          useAlertStore.setState({ alerts: updatedAlerts });
          break;
        case 'cases':
          const updatedCases = cases.filter(c => c.id !== id);
          useCaseStore.setState({ cases: updatedCases });
          break;
        case 'feed':
          const updatedFeedEvents = events.filter(e => String(e.id) !== String(id));
          useFeedStore.setState({ events: updatedFeedEvents });
          break;
      }
      
      showToast('🗑️ Item deleted successfully!');
    }
  };
  
  // Handle Add New
  const handleAddNew = () => {
    const newId = Date.now();
    switch (selectedCategory) {
      case 'targets':
        addTarget({
          id: newId,
          name: formData.name || 'New Target',
          role: formData.role || 'Unknown',
          avatar: formData.name?.slice(0, 2).toUpperCase() || 'NT',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
          status: formData.status || 'active',
          os: formData.os || 'iOS',
          device: formData.device || 'Unknown Device',
          country: formData.country || 'Unknown',
          infectedSince: new Date().toISOString().split('T')[0],
          agentVersion: 'v4.2.2',
        });
        break;
        
      case 'messages':
        addConversation({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          app: formData.app || 'whatsapp',
          contact: formData.contact || 'New Contact',
          preview: formData.preview || 'New message preview',
          unread: 0,
          lastMessageTime: new Date(),
          isEncrypted: true,
        });
        break;
        
      case 'locations':
        let coordinates = { lat: 0, lng: 0 };
        if (locationInputType === 'coordinates') {
          coordinates = {
            lat: parseFloat(formData.lat) || 35.6892,
            lng: parseFloat(formData.lng) || 51.3890,
          };
        } else {
          const ipMap: Record<string, { lat: number; lng: number; city: string }> = {
            '8.8.8.8': { lat: 37.7749, lng: -122.4194, city: 'Mountain View, CA' },
            '1.1.1.1': { lat: -33.8688, lng: 151.2093, city: 'Sydney, Australia' },
            '192.168.1.1': { lat: 40.7128, lng: -74.0060, city: 'New York, NY' },
          };
          const ipData = ipMap[formData.ip] || { lat: 35.6892, lng: 51.3890, city: 'Tehran, Iran' };
          coordinates = { lat: ipData.lat, lng: ipData.lng };
          formData.address = ipData.city;
        }
        
        addLocation({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          address: formData.address || 'Unknown Location',
          coordinates: coordinates,
          timestamp: new Date(),
          accuracy: formData.accuracy || 10,
          speed: formData.speed || 0,
        });
        break;
        
      case 'keylogs':
        addEntry({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          app: formData.app || 'WhatsApp',
          text: formData.text || 'Sample keystroke text',
          timestamp: new Date(),
          containsPassword: formData.containsPassword || false,
        });
        break;
        
      case 'passwords':
        addCredential({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          service: formData.service || 'New Service',
          username: formData.username || 'user@example.com',
          password: formData.password || 'password123',
          token: formData.token || '',
          capturedAt: new Date(),
          strength: formData.strength || 'medium',
        });
        break;
        
      case 'calls':
        addCall({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          direction: formData.direction || 'incoming',
          number: formData.number || '+1234567890',
          duration: formData.duration || 60,
          timestamp: new Date(),
          hasRecording: true,
          app: formData.app || 'Cellular',
        });
        break;
        
      case 'browser':
        addHistory({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          browser: formData.browser || 'chrome',
          url: formData.url || 'https://example.com',
          title: formData.title || 'Example Page',
          timestamp: new Date(),
          visitCount: 1,
        });
        break;
        
      case 'contacts':
        addContact({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          name: formData.name || 'New Contact',
          phoneNumbers: [formData.phone || '+1234567890'],
          emails: [formData.email || 'contact@example.com'],
          interactionCount: 0,
          lastInteraction: new Date(),
          isFrequent: false,
        });
        break;
        
      case 'emails':
        addEmail({
          id: newId,
          targetId: 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          from: formData.from || 'sender@example.com',
          to: [formData.to || 'recipient@example.com'],
          subject: formData.subject || 'New Email',
          body: formData.body || 'Email content here...',
          date: new Date(),
          hasAttachments: false,
          isRead: false,
          folder: 'inbox',
        });
        break;
        
      case 'alerts':
        addAlert({
          id: newId,
          type: formData.type || 'info',
          icon: formData.type === 'critical' ? '🔴' : formData.type === 'warning' ? '🟡' : '🔵',
          title: formData.title || 'New Alert',
          description: formData.description || 'Alert description',
          metadata: new Date().toLocaleString(),
          timestamp: new Date(),
          dismissed: false,
          acknowledged: false,
        });
        break;
	
      case 'cases':
        addCase({
          id: newId,
          name: formData.name || 'New Case',
          description: formData.description || 'Case description',
          status: formData.status || 'pending',
          priority: formData.priority || 'medium',
          targets: formData.targets ? formData.targets.split(',').map((t: string) => t.trim()) : ['New Target'],
          createdDate: new Date(),
          lastUpdated: new Date(),
          evidenceCount: formData.evidenceCount || 0,
        });
        break;
      
      case 'feed':
        addEvent({
          id: String(newId),
          targetId: formData.targetId || 1,
          targetName: formData.targetName || 'Ahmad Karimi',
          type: formData.type || 'message',
          app: formData.app || 'WhatsApp',
          message: formData.message || 'New activity event',
          severity: formData.severity || 'info',
          timestamp: new Date(),
        });
        break;
    }
    
    showToast('✅ Item added successfully!');
    setShowAddForm(false);
    setFormData({});
  };
  
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'edit-toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };
  
  const renderFormFields = () => {
    switch (selectedCategory) {
      case 'targets':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Target name" />
            </div>
            <div className="form-row">
              <label className="form-label">Role/Title</label>
              <input className="form-input" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g., Journalist, Activist" />
            </div>
            <div className="form-row">
              <label className="form-label">Device OS</label>
              <select className="form-select" value={formData.os || 'iOS'} onChange={(e) => setFormData({ ...formData, os: e.target.value })}>
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Device Model</label>
              <input className="form-input" value={formData.device || ''} onChange={(e) => setFormData({ ...formData, device: e.target.value })} placeholder="e.g., iPhone 14 Pro" />
            </div>
            <div className="form-row">
              <label className="form-label">Country</label>
              <input className="form-input" value={formData.country || ''} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
            </div>
            <div className="form-row">
              <label className="form-label">Status</label>
              <select className="form-select" value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </>
        );
      
      case 'feed':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <select 
                className="form-select" 
                value={formData.targetId || ''}
                onChange={(e) => {
                  const selectedTarget = targets.find(t => t.id === parseInt(e.target.value));
                  setFormData({ 
                    ...formData, 
                    targetId: selectedTarget?.id,
                    targetName: selectedTarget?.name 
                  });
                }}
              >
                <option value="">Select a target...</option>
                {targets.map(target => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Event Type</label>
              <select className="form-select" value={formData.type || 'message'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="message">Message</option>
                <option value="location">Location</option>
                <option value="call">Call</option>
                <option value="keylog">Keylog</option>
                <option value="camera">Camera</option>
                <option value="microphone">Microphone</option>
                <option value="app">App</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">App/Source</label>
              <input className="form-input" value={formData.app || ''} onChange={(e) => setFormData({ ...formData, app: e.target.value })} placeholder="e.g., WhatsApp, Signal, GPS" />
            </div>
            <div className="form-row">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" rows={3} value={formData.message || ''} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Activity description" />
            </div>
            <div className="form-row">
              <label className="form-label">Severity</label>
              <select className="form-select" value={formData.severity || 'info'} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </>
        );
        
      case 'messages':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">App</label>
              <select className="form-select" value={formData.app || 'whatsapp'} onChange={(e) => setFormData({ ...formData, app: e.target.value })}>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="signal">Signal</option>
                <option value="imessage">iMessage</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Contact Name</label>
              <input className="form-input" value={formData.contact || ''} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Message Preview</label>
              <textarea className="form-textarea" value={formData.preview || ''} onChange={(e) => setFormData({ ...formData, preview: e.target.value })} rows={3} />
            </div>
          </>
        );
        
      case 'locations':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Input Type</label>
              <div className="input-type-toggle">
                <button type="button" className={`toggle-btn ${locationInputType === 'coordinates' ? 'active' : ''}`} onClick={() => setLocationInputType('coordinates')}>
                  📍 Coordinates
                </button>
                <button type="button" className={`toggle-btn ${locationInputType === 'ip' ? 'active' : ''}`} onClick={() => setLocationInputType('ip')}>
                  🌐 IP Address
                </button>
              </div>
            </div>
            
            {locationInputType === 'coordinates' ? (
              <>
                <div className="form-row">
                  <label className="form-label">Address / Location Name</label>
                  <input className="form-input" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="e.g., Tehran, Iran" />
                </div>
                <div className="form-row two-columns">
                  <div>
                    <label className="form-label">Latitude</label>
                    <input type="number" step="any" className="form-input" value={formData.lat || formData.coordinates?.lat || ''} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} placeholder="35.6892" />
                  </div>
                  <div>
                    <label className="form-label">Longitude</label>
                    <input type="number" step="any" className="form-input" value={formData.lng || formData.coordinates?.lng || ''} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} placeholder="51.3890" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <label className="form-label">IP Address</label>
                  <input className="form-input" value={formData.ip || ''} onChange={(e) => setFormData({ ...formData, ip: e.target.value })} placeholder="e.g., 8.8.8.8, 1.1.1.1" />
                </div>
                <div className="info-hint">
                  💡 IP will be resolved to approximate location (simulated)
                </div>
              </>
            )}
            
            <div className="form-row two-columns">
              <div>
                <label className="form-label">Accuracy (meters)</label>
                <input type="number" className="form-input" value={formData.accuracy || 10} onChange={(e) => setFormData({ ...formData, accuracy: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="form-label">Speed (km/h)</label>
                <input type="number" className="form-input" value={formData.speed || 0} onChange={(e) => setFormData({ ...formData, speed: parseInt(e.target.value) })} />
              </div>
            </div>
          </>
        );
        
      case 'keylogs':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Application</label>
              <input className="form-input" value={formData.app || ''} onChange={(e) => setFormData({ ...formData, app: e.target.value })} placeholder="e.g., WhatsApp, Gmail, Notes" />
            </div>
            <div className="form-row">
              <label className="form-label">Keystroke Text</label>
              <textarea className="form-textarea" value={formData.text || ''} onChange={(e) => setFormData({ ...formData, text: e.target.value })} rows={5} placeholder="Captured keystrokes will appear here..." />
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={formData.containsPassword || false} onChange={(e) => setFormData({ ...formData, containsPassword: e.target.checked })} />
                Contains password/sensitive data
              </label>
            </div>
          </>
        );
        
      case 'passwords':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Service/App</label>
              <input className="form-input" value={formData.service || ''} onChange={(e) => setFormData({ ...formData, service: e.target.value })} placeholder="e.g., Gmail, WhatsApp" />
            </div>
            <div className="form-row">
              <label className="form-label">Username/Email</label>
              <input className="form-input" value={formData.username || ''} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="username@example.com" />
            </div>
            <div className="form-row">
              <label className="form-label">Password</label>
              <input className="form-input" type="text" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="password" />
            </div>
            <div className="form-row">
              <label className="form-label">Strength</label>
              <select className="form-select" value={formData.strength || 'medium'} onChange={(e) => setFormData({ ...formData, strength: e.target.value })}>
                <option value="strong">Strong</option>
                <option value="medium">Medium</option>
                <option value="weak">Weak</option>
              </select>
            </div>
          </>
        );
        
      case 'calls':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Direction</label>
              <select className="form-select" value={formData.direction || 'incoming'} onChange={(e) => setFormData({ ...formData, direction: e.target.value })}>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={formData.number || ''} onChange={(e) => setFormData({ ...formData, number: e.target.value })} />
            </div>
            <div className="form-row two-columns">
              <div>
                <label className="form-label">Duration (seconds)</label>
                <input type="number" className="form-input" value={formData.duration || 0} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="form-label">App</label>
                <input className="form-input" value={formData.app || ''} onChange={(e) => setFormData({ ...formData, app: e.target.value })} />
              </div>
            </div>
          </>
        );
        
      case 'browser':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Browser</label>
              <select className="form-select" value={formData.browser || 'chrome'} onChange={(e) => setFormData({ ...formData, browser: e.target.value })}>
                <option value="chrome">Chrome</option>
                <option value="safari">Safari</option>
                <option value="firefox">Firefox</option>
                <option value="edge">Edge</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">URL</label>
              <input className="form-input" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Page Title</label>
              <input className="form-input" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
          </>
        );
        
      case 'contacts':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Contact Name</label>
              <input className="form-input" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Email</label>
              <input className="form-input" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </>
        );
        
      case 'emails':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Target Name</label>
              <input className="form-input" value={formData.targetName || ''} onChange={(e) => setFormData({ ...formData, targetName: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">From</label>
              <input className="form-input" value={formData.from || ''} onChange={(e) => setFormData({ ...formData, from: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">To</label>
              <input className="form-input" value={formData.to || ''} onChange={(e) => setFormData({ ...formData, to: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Subject</label>
              <input className="form-input" value={formData.subject || ''} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Body</label>
              <textarea className="form-textarea" rows={4} value={formData.body || ''} onChange={(e) => setFormData({ ...formData, body: e.target.value })} />
            </div>
          </>
        );
        
      case 'alerts':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Alert Type</label>
              <select className="form-select" value={formData.type || 'info'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Title</label>
              <input className="form-input" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-row">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </>
        );
		
      case 'cases':
        return (
          <>
            <div className="form-row">
              <label className="form-label">Case Name</label>
              <input className="form-input" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Operation Nightfall" />
            </div>
            <div className="form-row">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Case description..." />
            </div>
            <div className="form-row two-columns">
              <div>
                <label className="form-label">Status</label>
                <select className="form-select" value={formData.status || 'pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="form-label">Priority</label>
                <select className="form-select" value={formData.priority || 'medium'} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <label className="form-label">Targets (comma-separated)</label>
              <input className="form-input" value={formData.targets ? (Array.isArray(formData.targets) ? formData.targets.join(', ') : formData.targets) : ''} onChange={(e) => setFormData({ ...formData, targets: e.target.value })} placeholder="e.g., Ahmad Karimi, Source Redacted" />
            </div>
            <div className="form-row">
              <label className="form-label">Evidence Count</label>
              <input type="number" className="form-input" value={formData.evidenceCount || 0} onChange={(e) => setFormData({ ...formData, evidenceCount: parseInt(e.target.value) })} />
            </div>
          </>
        );
        
      default:
        return <div className="info-message-small">Edit form for {selectedCategory} coming soon</div>;
    }
  };
  
  const renderTableData = () => {
    switch (selectedCategory) {
      case 'targets':
        return targets.map(target => (
          <tr key={target.id}>
            <td>{target.id}</td>
            <td><strong>{target.name}</strong></td>
            <td>{target.role}</td>
            <td><span className={`status-badge ${target.status}`}>{target.status}</span></td>
            <td>{target.os}</td>
            <td>{target.country}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(target)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(target.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'messages':
        return conversations.map(conv => (
          <tr key={conv.id}>
            <td>{conv.id}</td>
            <td>{conv.targetName}</td>
            <td><span className="app-badge">{conv.app}</span></td>
            <td><strong>{conv.contact}</strong></td>
            <td className="preview-cell">{conv.preview.substring(0, 50)}...</td>
            <td>{conv.unread > 0 ? `📬 ${conv.unread}` : '✓ Read'}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(conv)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(conv.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'locations':
        return locations.map(loc => (
          <tr key={loc.id}>
            <td>{loc.id}</td>
            <td>{loc.targetName}</td>
            <td className="address-cell">{loc.address}</td>
            <td className="coord-cell">{loc.coordinates.lat.toFixed(4)}°, {loc.coordinates.lng.toFixed(4)}°</td>
            <td>{new Date(loc.timestamp).toLocaleString()}</td>
            <td>{loc.accuracy}m</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(loc)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(loc.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'keylogs':
        return entries.map(entry => (
          <tr key={entry.id}>
            <td>{entry.id}</td>
            <td>{entry.targetName}</td>
            <td><span className="app-badge">{entry.app}</span></td>
            <td className="keylog-text-cell">{entry.text.substring(0, 60)}...</td>
            <td>{entry.containsPassword ? '🔐 Yes' : '📝 No'}</td>
            <td>{new Date(entry.timestamp).toLocaleString()}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(entry)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(entry.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'passwords':
        return credentials.map(cred => (
          <tr key={cred.id}>
            <td>{cred.id}</td>
            <td>{cred.targetName}</td>
            <td>{cred.service}</td>
            <td>{cred.username}</td>
            <td className="password-cell">{cred.password.substring(0, 15)}...</td>
            <td><span className={`strength-badge ${cred.strength}`}>{cred.strength}</span></td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(cred)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(cred.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'calls':
        return calls.map(call => (
          <tr key={call.id}>
            <td>{call.id}</td>
            <td>{call.targetName}</td>
            <td><span className={`direction-badge ${call.direction}`}>{call.direction}</span></td>
            <td>{call.number}</td>
            <td>{Math.floor(call.duration / 60)}m {call.duration % 60}s</td>
            <td>{call.app}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(call)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(call.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'browser':
        return history.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.targetName}</td>
            <td><span className="browser-badge">{item.browser}</span></td>
            <td className="url-cell">{item.url.substring(0, 50)}...</td>
            <td>{item.title}</td>
            <td>{new Date(item.timestamp).toLocaleDateString()}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(item)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(item.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'contacts':
        return contacts.map(contact => (
          <tr key={contact.id}>
            <td>{contact.id}</td>
            <td>{contact.targetName}</td>
            <td><strong>{contact.name}</strong></td>
            <td>{contact.phoneNumbers[0]}</td>
            <td>{contact.emails[0]}</td>
            <td>{contact.interactionCount} interactions</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(contact)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(contact.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'emails':
        return emails.map(email => (
          <tr key={email.id}>
            <td>{email.id}</td>
            <td>{email.targetName}</td>
            <td>{email.from}</td>
            <td className="subject-cell">{email.subject.substring(0, 40)}...</td>
            <td>{new Date(email.date).toLocaleDateString()}</td>
            <td>{email.isRead ? '✓ Read' : '📬 Unread'}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(email)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(email.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'alerts':
        return alerts.map(alert => (
          <tr key={alert.id}>
            <td>{alert.id}</td>
            <td><span className={`alert-type-badge ${alert.type}`}>{alert.type}</span></td>
            <td>{alert.title}</td>
            <td className="alert-desc-cell">{alert.description.substring(0, 50)}...</td>
            <td>{new Date(alert.timestamp).toLocaleString()}</td>
            <td>{alert.dismissed ? 'Dismissed' : 'Active'}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(alert)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(alert.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
		
      case 'cases':
        return cases.map(caseItem => (
          <tr key={caseItem.id}>
            <td>{caseItem.id}</td>
            <td><strong>{caseItem.name}</strong></td>
            <td className="description-cell">{caseItem.description.substring(0, 60)}...</td>
            <td><span className={`status-badge ${caseItem.status}`}>{caseItem.status}</span></td>
            <td><span className={`priority-badge ${caseItem.priority}`}>{caseItem.priority}</span></td>
            <td>{caseItem.targets.join(', ')}</td>
            <td>{caseItem.evidenceCount.toLocaleString()}</td>
            <td>{new Date(caseItem.lastUpdated).toLocaleDateString()}</td>
            <td>
              <button className="action-btn edit" onClick={() => handleEdit(caseItem)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(caseItem.id)}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      case 'feed':
        return events.map(event => (
          <tr key={event.id}>
            <td>{event.id}</td>
            <td className="event-target-cell">
              <select 
                className="target-select-inline"
                value={event.targetId}
                onChange={(e) => {
                  const selectedTarget = targets.find(t => t.id === parseInt(e.target.value));
                  if (selectedTarget) {
                    const updatedEvents = events.map(ev => 
                      ev.id === event.id 
                        ? { ...ev, targetId: selectedTarget.id, targetName: selectedTarget.name }
                        : ev
                    );
                    useFeedStore.setState({ events: updatedEvents });
                  }
                }}
              >
                {targets.map(target => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </select>
            </td>
            <td><span className={`event-type-badge ${event.type}`}>{event.type}</span></td>
            <td><span className="app-badge">{event.app}</span></td>
            <td className="event-message-cell">{event.message}</td>
            <td><span className={`severity-badge ${event.severity}`}>{event.severity}</span></td>
            <td>{new Date(event.timestamp).toLocaleString()}</td>
            <td>
              <button className="action-btn delete" onClick={() => handleDelete(Number(event.id))}>🗑️ Delete</button>
            </td>
          </tr>
        ));
        
      default:
        return (
          <tr>
            <td colSpan={7} className="info-placeholder">
              Select a category to view and edit data
            </td>
          </tr>
        );
    }
  };
  
  return (
    <div className="data-editor-panel">
      <div className="editor-sidebar">
        <div className="sidebar-header">
          <h4>📊 Data Categories</h4>
          <p>Click any category to edit simulated data</p>
        </div>
        <div className="category-list">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id as DataCategory)}
            >
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="editor-main">
        <div className="editor-header">
          <h3>{categories.find(c => c.id === selectedCategory)?.name}</h3>
          <button className="btn btn-primary" onClick={() => {
            setEditingItem(null);
            setFormData({});
            setShowAddForm(true);
          }}>
            + Add New
          </button>
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Target</th>
                {selectedCategory === 'targets' && <th>Role</th>}
                {selectedCategory === 'targets' && <th>Status</th>}
                {selectedCategory === 'targets' && <th>OS</th>}
                {selectedCategory === 'targets' && <th>Country</th>}
                {selectedCategory === 'messages' && <th>App</th>}
                {selectedCategory === 'messages' && <th>Contact</th>}
                {selectedCategory === 'messages' && <th>Preview</th>}
                {selectedCategory === 'messages' && <th>Status</th>}
                {selectedCategory === 'locations' && <th>Address</th>}
                {selectedCategory === 'locations' && <th>Coordinates</th>}
                {selectedCategory === 'locations' && <th>Time</th>}
                {selectedCategory === 'locations' && <th>Accuracy</th>}
                {selectedCategory === 'keylogs' && <th>App</th>}
                {selectedCategory === 'keylogs' && <th>Text Preview</th>}
                {selectedCategory === 'keylogs' && <th>Contains PW</th>}
                {selectedCategory === 'keylogs' && <th>Time</th>}
                {selectedCategory === 'passwords' && <th>Service</th>}
                {selectedCategory === 'passwords' && <th>Username</th>}
                {selectedCategory === 'passwords' && <th>Password</th>}
                {selectedCategory === 'passwords' && <th>Strength</th>}
                {selectedCategory === 'calls' && <th>Direction</th>}
                {selectedCategory === 'calls' && <th>Number</th>}
                {selectedCategory === 'calls' && <th>Duration</th>}
                {selectedCategory === 'calls' && <th>App</th>}
                {selectedCategory === 'browser' && <th>Browser</th>}
                {selectedCategory === 'browser' && <th>URL</th>}
                {selectedCategory === 'browser' && <th>Title</th>}
                {selectedCategory === 'browser' && <th>Date</th>}
                {selectedCategory === 'contacts' && <th>Name</th>}
                {selectedCategory === 'contacts' && <th>Phone</th>}
                {selectedCategory === 'contacts' && <th>Email</th>}
                {selectedCategory === 'contacts' && <th>Interactions</th>}
                {selectedCategory === 'emails' && <th>From</th>}
                {selectedCategory === 'emails' && <th>Subject</th>}
                {selectedCategory === 'emails' && <th>Date</th>}
                {selectedCategory === 'emails' && <th>Status</th>}
                {selectedCategory === 'alerts' && <th>Type</th>}
                {selectedCategory === 'alerts' && <th>Title</th>}
                {selectedCategory === 'alerts' && <th>Description</th>}
                {selectedCategory === 'alerts' && <th>Date</th>}
                {selectedCategory === 'alerts' && <th>State</th>}
                {selectedCategory === 'cases' && <th>Name</th>}
                {selectedCategory === 'cases' && <th>Description</th>}
                {selectedCategory === 'cases' && <th>Status</th>}
                {selectedCategory === 'cases' && <th>Priority</th>}
                {selectedCategory === 'cases' && <th>Targets</th>}
                {selectedCategory === 'cases' && <th>Evidence</th>}
                {selectedCategory === 'cases' && <th>Last Updated</th>}
                {selectedCategory === 'feed' && <th>Type</th>}
                {selectedCategory === 'feed' && <th>App/Source</th>}
                {selectedCategory === 'feed' && <th>Message</th>}
                {selectedCategory === 'feed' && <th>Severity</th>}
                {selectedCategory === 'feed' && <th>Time</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit/Add Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => { setShowAddForm(false); setEditingItem(null); }}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingItem ? `✏️ Edit ${selectedCategory.slice(0, -1)}` : `➕ Add New ${selectedCategory.slice(0, -1)}`}
              </div>
              <button className="modal-close" onClick={() => { setShowAddForm(false); setEditingItem(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); editingItem ? handleSaveEdit() : handleAddNew(); }}>
                {renderFormFields()}
                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowAddForm(false); setEditingItem(null); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? '💾 Save Changes' : '➕ Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
