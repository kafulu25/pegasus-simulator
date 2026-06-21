import React, { useState, useEffect, useRef } from 'react';
import { usePhoneScanStore } from '../../stores/phoneScanStore';
import { usePhoneScanSettingsStore } from '../../stores/phoneScanSettingsStore';
import { generatePacket, processPacketForData, buildFinalReport } from '../../utils/phoneScanUtils';
// Total scan duration: 3 hours (10800 seconds)
const SCAN_DURATION = 10800;

// Normal init total: 15 minutes
const INIT_STEPS_NORMAL = [
  '🔍 Searching for payload on remote device...',
  '✅ Payload found.',
  '📦 Payload status - Installed.',
  '🔗 Connecting to payload.',
  '🔄 Fetching from remote payload...',
  '🛰️ Connecting to satellite servers (calls, sms and voices)...',
  '📡 Connecting to area triangular cell towers...',
];
const NORMAL_STEP_DURATION_MS = Math.floor((15 * 60 * 1000) / INIT_STEPS_NORMAL.length);

// Failure init total: 5 minutes
const INIT_STEPS_FAILURE = [
  '🔍 Searching for payload on remote device...',
  '❌ Payload not found.',
  '❌ Payload status - Not Installed.',
  '❌ Connection failed.',
];
const FAILURE_STEP_DURATION_MS = Math.floor((5 * 60 * 1000) / INIT_STEPS_FAILURE.length);

// ===== Enhanced Country Mapping =====
const COUNTRY_MAP: Record<string, string> = {
  // Africa
  '+256': 'Uganda',
  '+254': 'Kenya',
  '+255': 'Tanzania',
  '+250': 'Rwanda',
  '+257': 'Burundi',
  '+258': 'Mozambique',
  '+260': 'Zambia',
  '+261': 'Madagascar',
  '+263': 'Zimbabwe',
  '+264': 'Namibia',
  '+265': 'Malawi',
  '+266': 'Lesotho',
  '+267': 'Botswana',
  '+268': 'Eswatini',
  '+269': 'Comoros',
  '+27': 'South Africa',
  '+211': 'South Sudan',
  '+212': 'Morocco',
  '+213': 'Algeria',
  '+216': 'Tunisia',
  '+218': 'Libya',
  '+220': 'Gambia',
  '+221': 'Senegal',
  '+222': 'Mauritania',
  '+223': 'Mali',
  '+224': 'Guinea',
  '+225': 'Côte d\'Ivoire',
  '+226': 'Burkina Faso',
  '+227': 'Niger',
  '+228': 'Togo',
  '+229': 'Benin',
  '+230': 'Mauritius',
  '+231': 'Liberia',
  '+232': 'Sierra Leone',
  '+233': 'Ghana',
  '+234': 'Nigeria',
  '+235': 'Chad',
  '+236': 'Central African Republic',
  '+237': 'Cameroon',
  '+238': 'Cape Verde',
  '+239': 'São Tomé and Príncipe',
  '+240': 'Equatorial Guinea',
  '+241': 'Gabon',
  '+242': 'Congo',
  '+243': 'DR Congo',
  '+244': 'Angola',
  '+245': 'Guinea-Bissau',
  '+248': 'Seychelles',
  '+249': 'Sudan',
  '+251': 'Ethiopia',
  '+252': 'Somalia',
  '+253': 'Djibouti',
  '+290': 'Saint Helena',
  '+291': 'Eritrea',
  '+297': 'Aruba',
  '+298': 'Faroe Islands',
  '+299': 'Greenland',
  // Americas
  '+1': 'USA/Canada',
  '+52': 'Mexico',
  '+53': 'Cuba',
  '+54': 'Argentina',
  '+55': 'Brazil',
  '+56': 'Chile',
  '+57': 'Colombia',
  '+58': 'Venezuela',
  '+591': 'Bolivia',
  '+592': 'Guyana',
  '+593': 'Ecuador',
  '+595': 'Paraguay',
  '+596': 'Martinique',
  '+597': 'Suriname',
  '+598': 'Uruguay',
  '+599': 'Curaçao',
  '+501': 'Belize',
  '+502': 'Guatemala',
  '+503': 'El Salvador',
  '+504': 'Honduras',
  '+505': 'Nicaragua',
  '+506': 'Costa Rica',
  '+507': 'Panama',
  '+509': 'Haiti',
  '+51': 'Peru',
  // Europe
  '+30': 'Greece',
  '+31': 'Netherlands',
  '+32': 'Belgium',
  '+33': 'France',
  '+34': 'Spain',
  '+36': 'Hungary',
  '+39': 'Italy',
  '+40': 'Romania',
  '+41': 'Switzerland',
  '+43': 'Austria',
  '+44': 'UK',
  '+45': 'Denmark',
  '+46': 'Sweden',
  '+47': 'Norway',
  '+48': 'Poland',
  '+49': 'Germany',
  '+350': 'Gibraltar',
  '+351': 'Portugal',
  '+352': 'Luxembourg',
  '+353': 'Ireland',
  '+354': 'Iceland',
  '+355': 'Albania',
  '+356': 'Malta',
  '+357': 'Cyprus',
  '+358': 'Finland',
  '+359': 'Bulgaria',
  '+370': 'Lithuania',
  '+371': 'Latvia',
  '+372': 'Estonia',
  '+373': 'Moldova',
  '+374': 'Armenia',
  '+375': 'Belarus',
  '+376': 'Andorra',
  '+377': 'Monaco',
  '+378': 'San Marino',
  '+379': 'Vatican',
  '+380': 'Ukraine',
  '+381': 'Serbia',
  '+382': 'Montenegro',
  '+383': 'Kosovo',
  '+385': 'Croatia',
  '+386': 'Slovenia',
  '+387': 'Bosnia',
  '+389': 'North Macedonia',
  '+420': 'Czech Republic',
  '+421': 'Slovakia',
  '+423': 'Liechtenstein',
  '+500': 'Falkland Islands',
  // Asia
  '+60': 'Malaysia',
  '+61': 'Australia',
  '+62': 'Indonesia',
  '+63': 'Philippines',
  '+64': 'New Zealand',
  '+65': 'Singapore',
  '+66': 'Thailand',
  '+81': 'Japan',
  '+82': 'South Korea',
  '+84': 'Vietnam',
  '+86': 'China',
  '+90': 'Turkey',
  '+91': 'India',
  '+92': 'Pakistan',
  '+93': 'Afghanistan',
  '+94': 'Sri Lanka',
  '+95': 'Myanmar',
  '+98': 'Iran',
  '+850': 'North Korea',
  '+852': 'Hong Kong',
  '+853': 'Macau',
  '+855': 'Cambodia',
  '+856': 'Laos',
  '+880': 'Bangladesh',
  '+886': 'Taiwan',
  '+960': 'Maldives',
  '+961': 'Lebanon',
  '+962': 'Jordan',
  '+963': 'Syria',
  '+964': 'Iraq',
  '+965': 'Kuwait',
  '+966': 'Saudi Arabia',
  '+967': 'Yemen',
  '+968': 'Oman',
  '+970': 'Palestine',
  '+971': 'UAE',
  '+972': 'Israel',
  '+973': 'Bahrain',
  '+974': 'Qatar',
  '+975': 'Bhutan',
  '+976': 'Mongolia',
  '+977': 'Nepal',
  '+992': 'Tajikistan',
  '+993': 'Turkmenistan',
  '+994': 'Azerbaijan',
  '+995': 'Georgia',
  '+996': 'Kyrgyzstan',
  '+998': 'Uzbekistan',
};

const MTN_PREFIXES = ['076', '077', '078', '079', '+25676', '+25677', '+25678', '+25679', '031', '039'];
const AIRTEL_PREFIXES = ['075', '070', '074', '+25675', '+25670', '+25674'];

const getCarrierInfo = (phone: string): { carrier: string; country: string } => {
  const cleaned = phone.replace(/\s/g, '');
  let country = 'Unknown';
  let countryCode = '';

  if (cleaned.startsWith('+')) {
    for (const [code, name] of Object.entries(COUNTRY_MAP).sort((a, b) => b[0].length - a[0].length)) {
      if (cleaned.startsWith(code)) {
        country = name;
        countryCode = code;
        break;
      }
    }
  } else if (cleaned.startsWith('00')) {
    const after00 = cleaned.substring(2);
    for (const [code, name] of Object.entries(COUNTRY_MAP).sort((a, b) => b[0].length - a[0].length)) {
      const codeWithoutPlus = code.replace('+', '');
      if (after00.startsWith(codeWithoutPlus)) {
        country = name;
        countryCode = code;
        break;
      }
    }
  } else {
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      country = 'Uganda';
      countryCode = '+256';
    }
  }

  let carrier = 'Unknown';
  if (country === 'Uganda') {
    for (const prefix of MTN_PREFIXES) {
      const normalizedPrefix = prefix.replace('+256', '0');
      if (cleaned.startsWith(normalizedPrefix) || cleaned.startsWith(prefix)) {
        carrier = 'MTN';
        break;
      }
    }
    if (carrier === 'Unknown') {
      for (const prefix of AIRTEL_PREFIXES) {
        const normalizedPrefix = prefix.replace('+256', '0');
        if (cleaned.startsWith(normalizedPrefix) || cleaned.startsWith(prefix)) {
          carrier = 'Airtel';
          break;
        }
      }
    }
  }
  return { carrier, country };
};

const PhoneScan: React.FC = () => {
  const [phoneInput, setPhoneInput] = useState('');
  
  // Use store for all UI state
  const {
    isScanning,
    progress,
    statusText,
    packets,
    discoveredCalls,
    discoveredMessages,
    discoveredContacts,
    scanResult,
    targetInfo,
    initComplete,
    completedInitSteps,
    isFailureMode,
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
    setTargetInfo,
    setInitComplete,
    setCompletedInitSteps,
    setIsFailureMode,
  } = usePhoneScanStore();

  const settings = usePhoneScanSettingsStore((state) => state.settings);
  const simulateFailure = settings.simulateFailure || false;

  const packetIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const packetsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (packetsEndRef.current) {
      packetsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [packets]);

  // On mount, restore phone input if there's a scan active? (optional)
  // We can store phone in store as well, but we'll keep it simple: just read from store if available.

  // Start scan function
  const handleStartScan = () => {
    if (!phoneInput.trim()) return;

    // Parse target info
    const info = getCarrierInfo(phoneInput.trim());
    setTargetInfo({
      phone: phoneInput.trim(),
      carrier: info.carrier,
      provider: info.carrier === 'Unknown' ? 'Unknown' : info.carrier,
      country: info.country,
    });

    reset(); // clears all state
    startScan(phoneInput);
    setInitComplete(false);
    setCompletedInitSteps([]);

    const failure = simulateFailure;
    setIsFailureMode(failure);
    const steps = failure ? INIT_STEPS_FAILURE : INIT_STEPS_NORMAL;
    const stepDuration = failure ? FAILURE_STEP_DURATION_MS : NORMAL_STEP_DURATION_MS;

    let stepIndex = 0;
    const runInitStep = () => {
      if (stepIndex >= steps.length) {
        setInitComplete(true);
        if (failure) {
          setStatus('Scan failed – payload not reachable.');
          stopScan();
          const result = buildFinalReport(phoneInput, [], [], new Set());
          completeScan(result);
          setStatus('❌ Connection failed. Payload not installed on target device.');
        } else {
          setStatus('Initialization complete. Starting packet capture...');
          startPacketFlow();
          startProgress();
        }
        return;
      }
      const msg = steps[stepIndex];
      setStatus(msg);
      // Append to completed steps
      setCompletedInitSteps([...completedInitSteps, msg]);
      initTimeoutRef.current = setTimeout(() => {
        stepIndex++;
        runInitStep();
      }, stepDuration);
    };
    runInitStep();
  };

  const startPacketFlow = () => {
    let localTime = new Date();
    packetIntervalRef.current = setInterval(() => {
      if (!usePhoneScanStore.getState().isScanning) {
        if (packetIntervalRef.current) clearInterval(packetIntervalRef.current);
        return;
      }
      const minsToAdd = Math.floor(Math.random() * 4) + 2;
      localTime.setMinutes(localTime.getMinutes() + minsToAdd);
      const packet = generatePacket(phoneInput);
      packet.timestamp = localTime.toISOString().replace('T', ' ').slice(0, 19);
      addPacket(packet);
      const extracted = processPacketForData(packet, phoneInput);
      if (extracted.call) addCall(extracted.call);
      if (extracted.message) addMessage(extracted.message);
      if (extracted.contact) addContact(extracted.contact);
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
    let progressVal = progress; // start from current
    const stepTime = (10800 * 1000) / 100; // 3 hours
    progressIntervalRef.current = setInterval(() => {
      if (!usePhoneScanStore.getState().isScanning) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        return;
      }
      progressVal += 1;
      setProgress(Math.min(progressVal, 100));
      setStatus(`3-hour deep scan in progress... ${progressVal}%`);
      if (progressVal >= 100) {
        if (packetIntervalRef.current) clearInterval(packetIntervalRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        stopScan();
        const result = buildFinalReport(phoneInput, discoveredCalls, discoveredMessages, discoveredContacts);
        completeScan(result);
        setStatus('Scan complete – report ready');
      }
    }, stepTime);
  };

  const handleStopScan = () => {
    if (packetIntervalRef.current) clearInterval(packetIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
    stopScan();
    setInitComplete(false);
    setCompletedInitSteps([]);
    setStatus('Scan aborted');
  };

  const handleReset = () => {
    handleStopScan();
    reset();
    setPhoneInput('');
  };

  const showInit = isScanning && !initComplete;
  const isFailureComplete = isFailureMode && scanResult && !isScanning;

  return (
    <div className="phone-scan-container" style={{ padding: '20px', background: '#0a0c10', color: '#e6edf3' }}>
      {/* Controls */}
      <div className="scan-controls" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="Enter phone number"
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

      {/* Target Info */}
      {targetInfo && !scanResult && (
        <div style={{
          background: 'linear-gradient(135deg, #0d1117, #161b22)',
          border: '1px solid #30363d',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📞</span>
            <div>
              <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#e6edf3' }}>{targetInfo.phone}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📶</span>
            <div>
              <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SIM Carrier</div>
              <div style={{
                fontSize: '15px',
                fontWeight: '500',
                color: targetInfo.carrier === 'MTN' ? '#f5f4ed' : targetInfo.carrier === 'Airtel' ? '#f5f4ed' : '#8b949e'
              }}>{targetInfo.carrier}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🌐</span>
            <div>
              <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Internet Provider</div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#e6edf3' }}>{targetInfo.provider}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📍</span>
            <div>
              <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Country</div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#e6edf3' }}>{targetInfo.country}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
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

      {/* Static Init Steps */}
      {completedInitSteps.length > 0 && (
        <div style={{
          background: 'rgba(16, 16, 24, 0.9)',
          border: '1px solid #30363d',
          borderRadius: '6px',
          padding: '8px 12px',
          marginBottom: '12px',
          maxHeight: '100px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}>
          {completedInitSteps.map((msg, idx) => (
            <div key={idx} style={{ color: '#f0e68c', padding: '2px 0' }}>{msg}</div>
          ))}
          {showInit && (
            <div style={{ color: '#f0e68c', padding: '2px 0' }}>⏳ {statusText}</div>
          )}
        </div>
      )}

      {/* Packet Console */}
      <div
        className="packet-view"
        style={{
          border: '1px solid #30363d',
          borderRadius: '6px',
          padding: '12px',
          height: '400px',
          overflowY: 'auto',
          background: '#0a0c10',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}
      >
        {!isScanning && packets.length === 0 && !scanResult && (
          <div style={{ color: '#8b949e' }}>Awaiting scan initiation...</div>
        )}
        {initComplete && !isFailureMode && packets.map((p, idx) => (
          <div key={idx} style={{ color: '#00ff00', borderBottom: '1px solid rgba(0,255,0,0.05)', padding: '2px 0', display: 'flex', flexWrap: 'wrap' }}>
            <span style={{ color: '#33ff33', marginRight: '12px' }}>{p.timestamp}</span>
            <span style={{ color: '#66ff66', marginRight: '8px' }}>[{p.type.toUpperCase()}]</span>
            <span style={{ color: '#00cc00', marginRight: '8px' }}>{p.data}</span>
            <span style={{ color: '#009900', wordBreak: 'break-all' }}>[Base64: {p.base64.substring(0, 20)}...]</span>
          </div>
        ))}
        <div ref={packetsEndRef} />
        {isFailureComplete && (
          <div style={{ color: '#ff4444', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>❌ CONNECTION FAILED</div>
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>Payload not installed on target device.</div>
            <div style={{ fontSize: '12px', color: '#ff8888', textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <strong>Technical Reasons:</strong><br />
              • Target device may have patched the vulnerability.<br />
              • Network firewall is blocking the payload.<br />
              • Payload signature was detected and removed.<br />
              • Device OS version is incompatible.<br />
              <br />
              <strong>Suggested Actions:</strong><br />
              1. Rebuild the payload with new evasion techniques.<br />
              2. Use a different infection vector (e.g., SMS, WhatsApp).<br />
              3. Re‑deploy the payload to the target remote device.<br />
              4. Consider using a zero‑day exploit for better success rate.
            </div>
          </div>
        )}
      </div>

      {/* Success Report */}
      {scanResult && !isFailureMode && (
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
                <thead><tr style={{ borderBottom: '1px solid #30363d' }}><th>Dir</th><th>Number</th><th>Duration</th><th>Time</th></tr></thead>
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
                <thead><tr style={{ borderBottom: '1px solid #30363d' }}><th>Direction</th><th>Content</th><th>Time</th></tr></thead>
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
