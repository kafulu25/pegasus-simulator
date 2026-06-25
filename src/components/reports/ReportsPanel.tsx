import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { TerminalReportPDF } from '@/utils/pdfGenerator';
import { useTargetStore } from '@/stores/targetStore';
import { useMessageStore } from '@/stores/messageStore';
import { useCallStore } from '@/stores/callStore';
import { useLocationStore } from '@/stores/locationStore';
import { useMediaStore } from '@/stores/mediaStore';
import { usePasswordStore } from '@/stores/passwordStore';
import { generateHTMLReport } from '@/utils/htmlReportGenerator';
import './ReportsPanel.css';

interface Report {
  id: number;
  name: string;
  type: 'intelligence' | 'financial' | 'technical' | 'summary';
  generatedBy: string;
  generatedDate: Date;
  size: string;
  case: string;
  keyFindings: string[];
}

interface EditableReportData {
  targetName: string;
  targetPhone: string;
  targetCoordinates: {
    lat: number;
    lng: number;
    ip: string;
  };
  calls: Array<{
    id: number;
    direction: 'incoming' | 'outgoing';
    number: string;
    duration: number;
    app: string;
    timestamp: Date;
  }>;
  messages: Array<{
    id: number;
    direction: 'in' | 'out';
    text: string;
    base64: string;
    timestamp: Date;
    isDeleted: boolean;
    app: string;
  }>;
  microphoneStatus: {
    success: boolean;
    error: string;
    timestamp: Date;
  };
}

const DEFAULT_TERMINAL_CONTENT = `[INFO] Pegasus Report Generator v4.2.2 - Intelligence Division
[INFO] ====================================================
[INFO] Available report formats:
[INFO]   1. Terminal PDF    - Green-on-black terminal style
[INFO]   2. HTML + Map      - Interactive map + Base64 messages
[INFO] 
[STATUS] Active Targets: 0
[STATUS] Total Data Volume: 2.4 TB
[STATUS] Messages Intercepted: 0
[STATUS] Call Recordings: 0
[STATUS] Location Points: 0
[STATUS] Extracted Credentials: 0

[!] Click "Edit Report Data" tab to customize report content
[!] Then click "Generate HTML Report" to see your changes

$ _`;

export const ReportsPanel: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'reports' | 'edit'>('reports');
  const [showEditControls, setShowEditControls] = useState(false); // hide by default

  const [terminalContent, setTerminalContent] = useState(DEFAULT_TERMINAL_CONTENT);
  const [isTerminalEditing, setIsTerminalEditing] = useState(false);

  const defaultReports: Report[] = [
    {
      id: 1,
      name: 'Q1 Intelligence Summary',
      type: 'summary',
      generatedBy: 'Operator 7',
      generatedDate: new Date(),
      size: '2.4 MB',
      case: 'Operation Nightfall',
      keyFindings: [
        '47 encrypted messages intercepted',
        '23 location track points identified',
        '12 new contacts discovered',
        '3 potential threat indicators detected',
      ],
    },
    {
      id: 2,
      name: 'Target Communications Analysis',
      type: 'intelligence',
      generatedBy: 'Analyst 3',
      generatedDate: new Date(Date.now() - 86400000),
      size: '5.1 MB',
      case: 'Operation Phoenix',
      keyFindings: [
        'Signal protocol used extensively',
        'Call patterns suggest coordination with external cell',
        'Encrypted WhatsApp messages contain references to "Project Nightfall"',
      ],
    },
    {
      id: 3,
      name: 'Financial Transactions Report',
      type: 'financial',
      generatedBy: 'Operator 7',
      generatedDate: new Date(Date.now() - 172800000),
      size: '1.8 MB',
      case: 'Operation Nightfall',
      keyFindings: [
        'Large transfers to offshore accounts detected',
        'Multiple small transactions used to avoid detection',
        'Crypto wallet activity identified',
      ],
    },
    {
      id: 4,
      name: 'Technical Exploit Analysis',
      type: 'technical',
      generatedBy: 'Engineer 2',
      generatedDate: new Date(Date.now() - 259200000),
      size: '3.2 MB',
      case: 'All Cases',
      keyFindings: [
        'Zero‑day vulnerability patched on target devices',
        'Payload persistence established on 3 out of 5 targets',
        'Network traffic analysis reveals C2 infrastructure',
      ],
    },
  ];

  const [reports, setReports] = useState<Report[]>(defaultReports);
  const [editingReportId, setEditingReportId] = useState<number | null>(null);

  const [editableData, setEditableData] = useState<EditableReportData>({
    targetName: 'Target001',
    targetPhone: '+256703675421',
    targetCoordinates: {
      lat: 35.6892,
      lng: 51.3890,
      ip: '185.165.29.182'
    },
    calls: [
      { id: 1, direction: 'incoming', number: '+256703675421', duration: 502, timestamp: new Date(), app: 'WhatsApp' },
      { id: 2, direction: 'outgoing', number: '+989123456789', duration: 180, timestamp: new Date(Date.now() - 3600000), app: 'Cellular' },
      { id: 3, direction: 'incoming', number: '+447911123456', duration: 944, timestamp: new Date(Date.now() - 7200000), app: 'Signal' },
      { id: 4, direction: 'outgoing', number: '+256703675421', duration: 45, timestamp: new Date(Date.now() - 10800000), app: 'Telegram' },
    ],
    messages: [
      { id: 1, direction: 'in', text: 'The documents are ready. Meet at 6pm.', base64: btoa('The documents are ready. Meet at 6pm.'), timestamp: new Date(), isDeleted: false, app: 'WhatsApp' },
      { id: 2, direction: 'out', text: 'Confirmed. I will be there.', base64: btoa('Confirmed. I will be there.'), timestamp: new Date(Date.now() - 1800000), isDeleted: false, app: 'WhatsApp' },
      { id: 3, direction: 'in', text: 'URGENT: Delete all previous messages. Security risk detected.', base64: btoa('URGENT: Delete all previous messages. Security risk detected.'), timestamp: new Date(Date.now() - 3600000), isDeleted: true, app: 'Signal' },
      { id: 4, direction: 'in', text: 'The package has been delivered to the safe house.', base64: btoa('The package has been delivered to the safe house.'), timestamp: new Date(Date.now() - 5400000), isDeleted: false, app: 'Telegram' },
      { id: 5, direction: 'out', text: 'I need the extraction plan by tomorrow.', base64: btoa('I need the extraction plan by tomorrow.'), timestamp: new Date(Date.now() - 7200000), isDeleted: true, app: 'Signal' },
    ],
    microphoneStatus: {
      success: false,
      error: 'END_TO_END_ENCRYPTION_DETECTED - Signal protocol prevents audio interception',
      timestamp: new Date()
    }
  });

  // Load saved data
  useEffect(() => {
    const savedTerminal = localStorage.getItem('pegasus_terminal_content');
    if (savedTerminal) setTerminalContent(savedTerminal);

    const savedReports = localStorage.getItem('pegasus_reports');
    if (savedReports) {
      try {
        const parsed = JSON.parse(savedReports);
        const reportsWithDates = parsed.map((r: any) => ({ ...r, generatedDate: new Date(r.generatedDate) }));
        setReports(reportsWithDates);
      } catch {}
    }
  }, []);

  const saveAllChanges = () => {
    localStorage.setItem('pegasus_terminal_content', terminalContent);
    localStorage.setItem('pegasus_reports', JSON.stringify(reports));
    showToast('✅ All changes saved successfully!');
  };

  // Terminal editing
  const toggleTerminalEdit = () => setIsTerminalEditing(!isTerminalEditing);
  const handleTerminalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTerminalContent(e.target.value);
  };
  const saveTerminalContent = () => {
    setIsTerminalEditing(false);
    localStorage.setItem('pegasus_terminal_content', terminalContent);
    showToast('✅ Terminal content saved!');
  };

  // Report editing helpers
  const startEditingReport = (id: number) => setEditingReportId(id);
  const stopEditingReport = () => setEditingReportId(null);

  const updateReportField = (id: number, field: keyof Report, value: any) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const deleteReport = (id: number) => {
    if (window.confirm('Delete this report?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const addNewReport = () => {
    const newId = Date.now();
    const newReport: Report = {
      id: newId,
      name: 'New Report',
      type: 'summary',
      generatedBy: 'Operator',
      generatedDate: new Date(),
      size: '0 MB',
      case: 'New Case',
      keyFindings: ['Add key findings here'],
    };
    setReports(prev => [...prev, newReport]);
    setEditingReportId(newId);
  };

  // Store helpers
  const { targets } = useTargetStore();
  const { conversations } = useMessageStore();
  const { calls } = useCallStore();
  const { locations } = useLocationStore();
  const { photos, documents, screenshots } = useMediaStore();
  const { credentials } = usePasswordStore();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'intelligence': return '🕵️';
      case 'financial': return '💰';
      case 'technical': return '⚙️';
      case 'summary': return '📊';
      default: return '📄';
    }
  };

  const showToast = (message: string, isError: boolean = false) => {
    const toast = document.createElement('div');
    toast.className = 'edit-toast';
    toast.style.background = isError ? '#ff4444' : '#0193c6';
    toast.style.color = '#ffffff';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const generateTerminalPDF = async () => {
    setIsGenerating(true);
    const totalMessages = conversations.reduce((sum, c) => sum + c.unread + 10, 0);
    const totalCalls = calls.length;
    const totalLocations = locations.length;
    const totalPhotos = photos.length + screenshots.length;
    const totalPasswords = credentials.length;
    const totalDataSize = '2.4 TB';

    const reportData = {
      caseName: 'Operation Nightfall - Intelligence Report',
      generatedBy: 'Operator 7',
      generatedDate: new Date(),
      targets: targets.map(t => ({
        name: t.name,
        role: t.role,
        status: t.status,
        dataCollected: {
          messages: Math.floor(Math.random() * 2000),
          calls: Math.floor(Math.random() * 100),
          locations: Math.floor(Math.random() * 500),
          photos: Math.floor(Math.random() * 300),
          passwords: Math.floor(Math.random() * 15),
        }
      })),
      summary: {
        totalMessages,
        totalCalls,
        totalLocations,
        totalPhotos,
        totalPasswords,
        totalDataSize,
      },
      keyFindings: [
        `Target Ahmad Karimi has exchanged 47 encrypted messages with a source designated [REDACTED]`,
        `Leila Nazari visited 23 unique locations in the past 7 days, indicating pattern of meetings`,
        `Marcus Webb accessed secure file sharing platforms 12 times this week`,
        `Credentials for 5 critical services were extracted including ProtonMail and Signal`,
        `Call analysis reveals contact with numbers from 6 different countries`,
      ],
      recommendations: [
        'Increase monitoring frequency on Ahmad Karimi - suspicious pattern detected',
        'Deploy additional geofencing for Leila Nazari based on movement patterns',
        'Extract browser history from Marcus Webb for deeper web activity analysis',
        'Schedule automatic credential rotation alerts for detected passwords',
        'Consider additional infiltration vectors for enhanced data collection',
      ],
    };

    try {
      const blob = await pdf(<TerminalReportPDF data={reportData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PEGASUS_TERMINAL_REPORT_${reportData.caseName.replace(/\s/g, '_')}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('✅ Terminal-style PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      showToast('❌ Failed to generate PDF. Please try again.', true);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHTMLReportWithEditableData = async () => {
    setIsGenerating(true);
    const callStats = {
      total: editableData.calls.length,
      incoming: editableData.calls.filter(c => c.direction === 'incoming').length,
      outgoing: editableData.calls.filter(c => c.direction === 'outgoing').length,
      uniqueNumbers: new Set(editableData.calls.map(c => c.number)).size,
      totalDuration: editableData.calls.reduce((sum, c) => sum + c.duration, 0),
    };
    const targetData = {
      targetName: editableData.targetName,
      targetPhone: editableData.targetPhone,
      targetCoordinates: editableData.targetCoordinates,
      calls: editableData.calls,
      messages: editableData.messages,
      microphoneStatus: editableData.microphoneStatus,
      callStats: callStats,
      deletedMessages: editableData.messages.filter(m => m.isDeleted).length,
      locationCount: 23
    };
    try {
      const htmlContent = generateHTMLReport(targetData);
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      window.open(htmlUrl, '_blank');
      URL.revokeObjectURL(htmlUrl);
      showToast('✅ HTML report generated with your custom data!');
    } catch (error) {
      console.error('Report generation failed:', error);
      showToast('❌ Failed to generate report', true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Editable data handlers
  const updateTargetInfo = (field: string, value: string | number) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };
  const updateCoordinates = (field: 'lat' | 'lng' | 'ip', value: string | number) => {
    setEditableData(prev => ({
      ...prev,
      targetCoordinates: { ...prev.targetCoordinates, [field]: value }
    }));
  };
  const addCall = () => {
    const newCall = {
      id: Date.now(),
      direction: 'incoming' as const,
      number: '+1234567890',
      duration: 60,
      timestamp: new Date(),
      app: 'WhatsApp'
    };
    setEditableData(prev => ({ ...prev, calls: [...prev.calls, newCall] }));
  };
  const updateCall = (id: number, field: string, value: any) => {
    setEditableData(prev => ({
      ...prev,
      calls: prev.calls.map(call => call.id === id ? { ...call, [field]: value } : call)
    }));
  };
  const deleteCall = (id: number) => {
    setEditableData(prev => ({ ...prev, calls: prev.calls.filter(call => call.id !== id) }));
  };
  const addMessage = () => {
    const newMessage = {
      id: Date.now(),
      direction: 'in' as const,
      text: 'New message content',
      base64: btoa('New message content'),
      timestamp: new Date(),
      isDeleted: false,
      app: 'WhatsApp'
    };
    setEditableData(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
  };
  const updateMessage = (id: number, field: string, value: any) => {
    setEditableData(prev => ({
      ...prev,
      messages: prev.messages.map(msg => {
        if (msg.id === id) {
          const updated = { ...msg, [field]: value };
          if (field === 'text') {
            updated.base64 = btoa(value);
          }
          return updated;
        }
        return msg;
      })
    }));
  };
  const deleteMessage = (id: number) => {
    setEditableData(prev => ({ ...prev, messages: prev.messages.filter(msg => msg.id !== id) }));
  };
  const toggleMicrophoneStatus = () => {
    setEditableData(prev => ({
      ...prev,
      microphoneStatus: {
        ...prev.microphoneStatus,
        success: !prev.microphoneStatus.success,
        timestamp: new Date()
      }
    }));
  };

  return (
    <div className="reports-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">📊</span> Reports & Analytics
          </div>
          <div className="panel-subtitle">Generate and export intelligence reports</div>
        </div>
        <div className="header-actions">
          <button className="btn-toggle-edit" onClick={() => setShowEditControls(!showEditControls)}>
            {showEditControls ? '🔒 Hide Edit Controls' : '🔓 Show Edit Controls'}
          </button>
          <button className="btn-save-all" onClick={saveAllChanges}>
            💾 Save All Changes
          </button>
        </div>
      </div>

      <div className="report-tabs">
        <button
          className={`report-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📄 Generate Reports
        </button>
        <button
          className={`report-tab ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          ✏️ Edit Report Data
        </button>
      </div>

      {activeTab === 'reports' ? (
        <>
          <div className="report-filters">
            <div className="filter-group">
              <label>Date Range:</label>
              <div className="date-buttons">
                <button className={`date-btn ${dateRange === 'today' ? 'active' : ''}`} onClick={() => setDateRange('today')}>Today</button>
                <button className={`date-btn ${dateRange === 'week' ? 'active' : ''}`} onClick={() => setDateRange('week')}>Last 7 Days</button>
                <button className={`date-btn ${dateRange === 'month' ? 'active' : ''}`} onClick={() => setDateRange('month')}>Last 30 Days</button>
                <button className={`date-btn ${dateRange === 'custom' ? 'active' : ''}`} onClick={() => setDateRange('custom')}>Custom</button>
              </div>
            </div>
            <div className="filter-group">
              <label>Case:</label>
              <select className="filter-select">
                <option>All Cases</option>
                <option>Operation Nightfall</option>
                <option>Operation Phoenix</option>
                <option>Operation Guardian</option>
              </select>
            </div>
          </div>

          {/* Terminal Preview – edit button hidden by default */}
          <div className="terminal-preview">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">pegasus@intel:~/reports$ ./generate --all-formats</span>
              {showEditControls && (
                <button className="terminal-edit-btn" onClick={toggleTerminalEdit} title="Edit terminal content">
                  {isTerminalEditing ? '✕' : '✏️'}
                </button>
              )}
            </div>
            <div className="terminal-body">
              {isTerminalEditing ? (
                <textarea
                  className="terminal-textarea"
                  value={terminalContent}
                  onChange={handleTerminalChange}
                  rows={12}
                  cols={80}
                  autoFocus
                />
              ) : (
                <pre className="terminal-output">{terminalContent}</pre>
              )}
              {isTerminalEditing && (
                <div className="terminal-save-area">
                  <button className="btn-sm" onClick={saveTerminalContent}>Save Terminal Content</button>
                </div>
              )}
            </div>
          </div>

          <div className="scroll-content">
            <div className="reports-header-actions">
              <span className="reports-count">{reports.length} reports</span>
              <button className="btn-add-report" onClick={addNewReport}>+ Add Report</button>
            </div>
            <div className="reports-grid">
              {reports.map(report => (
                <div
                  key={report.id}
                  className={`report-card ${editingReportId === report.id ? 'editing' : ''}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="report-icon">{getTypeIcon(report.type)}</div>
                  <div className="report-info">
                    {editingReportId === report.id ? (
                      <div className="report-edit-form" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={report.name}
                          onChange={(e) => updateReportField(report.id, 'name', e.target.value)}
                          className="edit-input-small"
                          placeholder="Report name"
                        />
                        <select
                          value={report.type}
                          onChange={(e) => updateReportField(report.id, 'type', e.target.value as any)}
                          className="edit-select-small"
                        >
                          <option value="summary">Summary</option>
                          <option value="intelligence">Intelligence</option>
                          <option value="financial">Financial</option>
                          <option value="technical">Technical</option>
                        </select>
                        <input
                          type="text"
                          value={report.case}
                          onChange={(e) => updateReportField(report.id, 'case', e.target.value)}
                          className="edit-input-small"
                          placeholder="Case"
                        />
                        <input
                          type="text"
                          value={report.generatedBy}
                          onChange={(e) => updateReportField(report.id, 'generatedBy', e.target.value)}
                          className="edit-input-small"
                          placeholder="Generated by"
                        />
                        <button className="btn-icon-save" onClick={() => stopEditingReport()} title="Save">✅</button>
                        <button className="btn-icon-danger" onClick={() => deleteReport(report.id)} title="Delete">🗑️</button>
                      </div>
                    ) : (
                      <>
                        <div className="report-name">{report.name}</div>
                        <div className="report-meta">
                          <span className="report-type">{report.type}</span>
                          <span className="report-case">{report.case}</span>
                        </div>
                        <div className="report-details">
                          <span>👤 {report.generatedBy}</span>
                          <span>📅 {new Date(report.generatedDate).toLocaleDateString()}</span>
                          <span>💾 {report.size}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="report-actions">
                    {showEditControls && editingReportId !== report.id && (
                      <button
                        className="action-icon"
                        onClick={(e) => { e.stopPropagation(); startEditingReport(report.id); }}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      className="action-icon"
                      onClick={(e) => { e.stopPropagation(); generateTerminalPDF(); }}
                    >
                      ⬇️ PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="generate-section">
              <button
                className="generate-btn"
                onClick={generateHTMLReportWithEditableData}
                disabled={isGenerating}
              >
                {isGenerating ? '⏳ Generating...' : '🌐 Generate HTML Report (with your data)'}
              </button>
            </div>
          </div>
        </>
      ) : (
        // ===== Edit Report Data Tab =====
        <div className="edit-data-section">
          <div className="edit-header">
            <h3>✏️ Edit Report Data</h3>
            <p>Customize the data that will appear in your report. Changes are applied immediately when you generate the report.</p>
          </div>

          <div className="edit-card">
            <div className="edit-card-title">🎯 Target Information</div>
            <div className="edit-form">
              <div className="form-group">
                <label>Target Name</label>
                <input
                  type="text"
                  value={editableData.targetName}
                  onChange={(e) => updateTargetInfo('targetName', e.target.value)}
                  className="edit-input"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={editableData.targetPhone}
                  onChange={(e) => updateTargetInfo('targetPhone', e.target.value)}
                  className="edit-input"
                />
              </div>
              <div className="form-group">
                <label>IP Address</label>
                <input
                  type="text"
                  value={editableData.targetCoordinates.ip}
                  onChange={(e) => updateCoordinates('ip', e.target.value)}
                  className="edit-input"
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editableData.targetCoordinates.lat}
                    onChange={(e) => updateCoordinates('lat', parseFloat(e.target.value))}
                    className="edit-input"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editableData.targetCoordinates.lng}
                    onChange={(e) => updateCoordinates('lng', parseFloat(e.target.value))}
                    className="edit-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="edit-card">
            <div className="edit-card-title">
              📞 Call Logs
              <button className="btn-small btn-add" onClick={addCall}>+ Add Call</button>
            </div>
            <div className="calls-editor">
              {editableData.calls.map(call => (
                <div key={call.id} className="call-edit-item">
                  <select
                    value={call.direction}
                    onChange={(e) => updateCall(call.id, 'direction', e.target.value)}
                    className="edit-select-small"
                  >
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                  <input
                    type="text"
                    value={call.number}
                    onChange={(e) => updateCall(call.id, 'number', e.target.value)}
                    className="edit-input-small"
                    placeholder="Phone number"
                  />
                  <input
                    type="number"
                    value={call.duration}
                    onChange={(e) => updateCall(call.id, 'duration', parseInt(e.target.value))}
                    className="edit-input-tiny"
                    placeholder="Duration (sec)"
                  />
                  <input
                    type="text"
                    value={call.app}
                    onChange={(e) => updateCall(call.id, 'app', e.target.value)}
                    className="edit-input-small"
                    placeholder="App"
                  />
                  <button className="btn-icon-danger" onClick={() => deleteCall(call.id)}>🗑️</button>
                </div>
              ))}
            </div>
          </div>

          <div className="edit-card">
            <div className="edit-card-title">
              💬 Intercepted Messages
              <button className="btn-small btn-add" onClick={addMessage}>+ Add Message</button>
            </div>
            <div className="messages-editor">
              {editableData.messages.map(msg => (
                <div key={msg.id} className="message-edit-item">
                  <div className="message-edit-header">
                    <select
                      value={msg.direction}
                      onChange={(e) => updateMessage(msg.id, 'direction', e.target.value)}
                      className="edit-select-small"
                    >
                      <option value="in">Received (←)</option>
                      <option value="out">Sent (→)</option>
                    </select>
                    <select
                      value={msg.app}
                      onChange={(e) => updateMessage(msg.id, 'app', e.target.value)}
                      className="edit-select-small"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Signal">Signal</option>
                      <option value="Telegram">Telegram</option>
                      <option value="iMessage">iMessage</option>
                    </select>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={msg.isDeleted}
                        onChange={(e) => updateMessage(msg.id, 'isDeleted', e.target.checked)}
                      />
                      Deleted
                    </label>
                    <button className="btn-icon-danger" onClick={() => deleteMessage(msg.id)}>🗑️</button>
                  </div>
                  <textarea
                    value={msg.text}
                    onChange={(e) => updateMessage(msg.id, 'text', e.target.value)}
                    className="edit-textarea"
                    rows={2}
                    placeholder="Message content"
                  />
                  <div className="base64-preview">Base64: {btoa(msg.text).substring(0, 60)}...</div>
                </div>
              ))}
            </div>
          </div>

          <div className="edit-card">
            <div className="edit-card-title">🎙️ Microphone Status</div>
            <div className="microphone-editor">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={editableData.microphoneStatus.success}
                  onChange={toggleMicrophoneStatus}
                />
                <span>Microphone Interception {editableData.microphoneStatus.success ? 'ACTIVE ✓' : 'FAILED ✗'}</span>
              </label>
              {!editableData.microphoneStatus.success && (
                <div className="form-group">
                  <label>Error Message</label>
                  <textarea
                    value={editableData.microphoneStatus.error}
                    onChange={(e) => setEditableData(prev => ({
                      ...prev,
                      microphoneStatus: { ...prev.microphoneStatus, error: e.target.value }
                    }))}
                    className="edit-textarea"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="generate-section-bottom">
            <button
              className="generate-btn-large"
              onClick={generateHTMLReportWithEditableData}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generating Report...' : '🌐 Generate Report with Custom Data'}
            </button>
          </div>
        </div>
      )}

      {/* ===== Modal with Editable Key Findings ===== */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Report Preview: {selectedReport.name}</div>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="report-preview">
                <div className="preview-header">
                  <h3>{selectedReport.name}</h3>
                  <p>Generated: {new Date(selectedReport.generatedDate).toLocaleString()}</p>
                  <p>By: {selectedReport.generatedBy}</p>
                  <p>Case: {selectedReport.case}</p>
                </div>
                <div className="preview-content">
                  <h4>Executive Summary</h4>
                  <p>This report contains intelligence gathered from surveillance operations against {selectedReport.case}. Key findings include unusual communication patterns and potential coordination with external entities.</p>
                  <h4>Key Findings</h4>
                  <div className="findings-edit-area">
                    <textarea
                      value={selectedReport.keyFindings.join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                        const updated = { ...selectedReport, keyFindings: lines };
                        setSelectedReport(updated);
                        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
                      }}
                      rows={6}
                      className="findings-textarea"
                      placeholder="Enter each finding on a new line"
                    />
                    <div className="findings-helper">
                      <span>💡 Edit the key findings – each line becomes a bullet point.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={generateTerminalPDF}>📄 Terminal PDF</button>
              <button className="btn btn-primary" onClick={generateHTMLReportWithEditableData}>🌐 HTML + Map</button>
              <button className="btn btn-ghost" onClick={() => setSelectedReport(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
