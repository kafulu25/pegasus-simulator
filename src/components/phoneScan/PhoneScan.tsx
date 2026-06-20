import React, { useState, useEffect, useRef } from 'react';
import { usePhoneScanStore } from '../../stores/phoneScanStore';
import { usePhoneScanSettingsStore } from '../../stores/phoneScanSettingsStore';
import { generatePacket, processPacketForData, buildFinalReport } from '../../utils/phoneScanUtils';

// Total scan duration: 3 hours (10800 seconds)
const SCAN_DURATION = 10800; // 3 hours

// Init phases durations (in milliseconds)
const INIT_FETCH_PAYLOAD = 15 * 60 * 1000; // 15 minutes
const INIT_SATELLITE = 7.5 * 60 * 1000;    // 7.5 minutes
const INIT_TOWERS = 7.5 * 60 * 1000;       // 7.5 minutes

const PhoneScan: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [initStep, setInitStep] = useState(0);
  const [initComplete, setInitComplete] = useState(false);

  const {
    isScanning,
    progress,
    statusText,
    packets,
    discoveredCalls,
    discoveredMessages,
    discoveredContacts,
    scanResult,
    startScan,
    stopScan,
    addPacket,
    addCall,
    addMessage,
    addContact,
    setProgress,
    setStatus,
    completeScan,
    reset,
  } = usePhoneScanStore();

  const settings = usePhoneScanSettingsStore((state) => state.settings);

  const packetIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const packetsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll packet view
  useEffect(() => {
    if (packetsEndRef.current) {
      packetsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [packets]);

  // Cleanup intervals on unmount – but ONLY if scan is not active
  useEffect(() => {
    return () => {
      // If scan is still active, we keep intervals running (they are global)
      // We don't clear them here because they are needed for background operation.
      // They will be cleared when the scan finishes or is aborted.
      // However, we should clear timeouts that are not needed.
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      // packetIntervalRef and progressIntervalRef are kept running intentionally.
    };
  }, []);

  const handleStartScan = () => {
    if (!phone.trim()) return;
    reset();
    startScan(phone);
    setInitStep(1);
    setInitComplete(false);

    // Initialization sequence with precise timings
    const steps = [
      { msg: '🔄 Fetching from remote payload...', duration: INIT_FETCH_PAYLOAD },
      { msg: '🛰️ Connecting to satellite servers (calls, sms and voices)...', duration: INIT_SATELLITE },
      { msg: '📡 Connecting to area triangular cell towers...', duration: INIT_TOWERS },
    ];

    let stepIndex = 0;
    const runInitStep = () => {
      if (stepIndex >= steps.length) {
        // All init steps complete
        setInitComplete(true);
        setStatus('Initialization complete. Starting packet capture...');
        startPacketFlow();
        startProgress();
        return;
      }
      const step = steps[stepIndex];
      setStatus(step.msg);
      setInitStep(stepIndex + 1);
      initTimeoutRef.current = setTimeout(() => {
        stepIndex++;
        runInitStep();
      }, step.duration);
    };

    runInitStep();
  };

  const startPacketFlow = () => {
    let localTime = new Date();

    packetIntervalRef.current = setInterval(() => {
      if (!usePhoneScanStore.getState().isScanning) {
        // If scan was stopped externally, clear this interval
        if (packetIntervalRef.current) {
          clearInterval(packetIntervalRef.current);
          packetIntervalRef.current = null;
        }
        return;
      }
      const minsToAdd = Math.floor(Math.random() * 4) + 2;
      localTime.setMinutes(localTime.getMinutes() + minsToAdd);
      const packet = generatePacket(phone);
      packet.timestamp = localTime.toISOString().replace('T', ' ').slice(0, 19);
      addPacket(packet);

      const extracted = processPacketForData(packet, phone);
      if (extracted.call) addCall(extracted.call);
      if (extracted.message) addMessage(extracted.message);
      if (extracted.contact) addContact(extracted.contact);

      // Update status occasionally with more technical messages
      if (packets.length % 10 === 0 && packets.length > 0) {
        const statuses = [
          'Sniffing network traffic...',
          'Decrypting handshake...',
          'Triangulating cell towers...',
          'Extracting metadata...',
          'Building packet timeline...',
          'Deep packet inspection...',
          'Analyzing packet payloads...',
          'Reassembling data streams...',
          'Decrypting end-to-end encrypted messages...',
          'Extracting encrypted voice packets...',
          'Fetching gallery thumbnails...',
          'Parsing WhatsApp database...',
          'Decoding Signal protocol...',
          'Intercepting Telegram MTProto...',
        ];
        setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, settings.packetIntervalMs);
  };

  const startProgress = () => {
    let progressVal = 0;
    // Each step increments by 1% over a calculated interval to reach 100% in SCAN_DURATION seconds
    const stepTime = (SCAN_DURATION * 1000) / 100;

    progressIntervalRef.current = setInterval(() => {
      if (!usePhoneScanStore.getState().isScanning) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        return;
      }
      progressVal += 1;
      setProgress(Math.min(progressVal, 100));
      setStatus(`3-hour deep scan in progress... ${progressVal}%`);
      if (progressVal >= 100) {
        // Scan complete
        if (packetIntervalRef.current) {
          clearInterval(packetIntervalRef.current);
          packetIntervalRef.current = null;
        }
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        stopScan();
        const result = buildFinalReport(phone, discoveredCalls, discoveredMessages, discoveredContacts);
        completeScan(result);
        setStatus('Scan complete – report ready');
      }
    }, stepTime);
  };

  const handleStopScan = () => {
    if (packetIntervalRef.current) {
      clearInterval(packetIntervalRef.current);
      packetIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
    stopScan();
    setInitStep(0);
    setInitComplete(false);
    setStatus('Scan aborted');
  };

  const handleReset = () => {
    handleStopScan(); // stops everything and resets state
    reset();
    setInitStep(0);
    setInitComplete(false);
  };

  const showInit = isScanning && !initComplete;

  return (
    <div className="phone-scan-container" style={{ padding: '20px', background: '#0a0c10', color: '#e6edf3' }}>
      <div className="scan-controls" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter Ugandan phone (e.g., 0755123456)"
          disabled={isScanning}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: '#161b22',
            border: `1px solid ${isScanning ? '#30363d' : '#0193c6'}`,
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '14px',
            outline: 'none',
            minWidth: '200px',
          }}
        />
        {!isScanning ? (
          <button
            onClick={handleStartScan}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #0193c6, #017aa6)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(1,147,198,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            INITIATE DEEP SCAN
          </button>
        ) : (
          <button
            onClick={handleStopScan}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              color: '#ff4444',
              border: '1px solid #ff4444',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ABORT
          </button>
        )}
        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#8b949e',
            border: '1px solid #30363d',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          CLEAR
        </button>
      </div>

      {isScanning && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b949e' }}>
            <span style={{ color: showInit ? '#f0e68c' : '#0193c6' }}>{statusText}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#161b22', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#0193c6', transition: 'width 0.3s' }}></div>
          </div>
        </div>
      )}

      <div
        className="packet-view"
        style={{
          border: '1px solid #30363d',
          borderRadius: '6px',
          padding: '12px',
          height: '300px',
          overflowY: 'auto',
          background: '#0a0c10',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}
      >
        {!isScanning && packets.length === 0 && (
          <div style={{ color: '#8b949e' }}>Awaiting scan initiation...</div>
        )}
        {showInit && (
          <div style={{ color: '#f0e68c', whiteSpace: 'pre-wrap' }}>
            {statusText}
          </div>
        )}
        {initComplete && packets.map((p, idx) => (
          <div key={idx} style={{ color: '#00ff00', borderBottom: '1px solid rgba(0,255,0,0.05)', padding: '2px 0', display: 'flex', flexWrap: 'wrap' }}>
            <span style={{ color: '#33ff33', marginRight: '12px' }}>{p.timestamp}</span>
            <span style={{ color: '#66ff66', marginRight: '8px' }}>[{p.type.toUpperCase()}]</span>
            <span style={{ color: '#00cc00', marginRight: '8px' }}>{p.data}</span>
            <span style={{ color: '#009900', wordBreak: 'break-all' }}>[Base64: {p.base64.substring(0, 20)}...]</span>
          </div>
        ))}
        <div ref={packetsEndRef} />
      </div>

      {scanResult && (
        <div style={{ marginTop: '24px', borderTop: '1px solid #30363d', paddingTop: '20px' }}>
          <h3 style={{ color: '#0193c6' }}>📡 SCAN REPORT – {scanResult.phoneNumber}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <div style={{ border: '1px solid #30363d', padding: '12px', borderRadius: '6px' }}>
              <h4 style={{ color: '#8b949e', fontSize: '12px' }}>📍 Coordinates</h4>
              <p>{scanResult.coordinates.lat}, {scanResult.coordinates.lng}</p>
              <a href={`https://www.google.com/maps?q=${scanResult.coordinates.lat},${scanResult.coordinates.lng}`} target="_blank" style={{ color: '#0193c6' }}>View Map</a>
              <p style={{ fontSize: '11px', color: '#8b949e' }}>Last ping: {scanResult.coordinates.timestamp}</p>
            </div>
            <div style={{ border: '1px solid #30363d', padding: '12px', borderRadius: '6px' }}>
              <h4 style={{ color: '#8b949e', fontSize: '12px' }}>📱 Installed Apps</h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                {scanResult.installedApps.map(app => <li key={app}>{app}</li>)}
              </ul>
            </div>
          </div>

          <div style={{ border: '1px solid #30363d', padding: '12px', borderRadius: '6px', marginTop: '12px' }}>
            <h4 style={{ color: '#8b949e', fontSize: '12px' }}>📞 Calls ({scanResult.calls.length})</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid #30363d' }}><th style={{ textAlign: 'left' }}>Dir</th><th style={{ textAlign: 'left' }}>Number</th><th style={{ textAlign: 'left' }}>Duration</th><th style={{ textAlign: 'left' }}>Time</th></tr></thead>
                <tbody>
                  {scanResult.calls.map((call, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(48,54,61,0.3)' }}>
                      <td>{call.direction}</td>
                      <td>{call.number}</td>
                      <td>{call.duration}s</td>
                      <td>{new Date(call.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ border: '1px solid #30363d', padding: '12px', borderRadius: '6px', marginTop: '12px' }}>
            <h4 style={{ color: '#8b949e', fontSize: '12px' }}>💬 Messages ({scanResult.messages.length})</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid #30363d' }}><th style={{ textAlign: 'left' }}>Direction</th><th style={{ textAlign: 'left' }}>Content</th><th style={{ textAlign: 'left' }}>Time</th></tr></thead>
                <tbody>
                  {scanResult.messages.map((msg, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(48,54,61,0.3)' }}>
                      <td>{msg.direction}</td>
                      <td>{msg.text}</td>
                      <td>{new Date(msg.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ border: '1px solid #30363d', padding: '12px', borderRadius: '6px', marginTop: '12px' }}>
            <h4 style={{ color: '#8b949e', fontSize: '12px' }}>🔗 Associated Numbers</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {scanResult.associatedNumbers.map((assoc, i) => (
                <span key={i} style={{ background: 'rgba(1,147,198,0.1)', padding: '4px 12px', border: '1px solid #30363d', borderRadius: '4px', fontSize: '11px' }}>
                  {assoc.number} (freq: {assoc.frequency})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneScan;
