import React, { useState, useEffect, useRef } from 'react';
import { usePhoneScanStore } from '../../stores/phoneScanStore';
import { generatePacket, processPacketForData, buildFinalReport } from '../../utils/phoneScanUtils';

const SCAN_DURATION = 30; // seconds

const PhoneScan: React.FC = () => {
  const [phone, setPhone] = useState('');
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

  const packetIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const packetsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (packetsEndRef.current) {
      packetsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [packets]);

  const handleStartScan = () => {
    if (!phone.trim()) {
      console.log('No phone number entered');
      return;
    }
    console.log('Starting scan for:', phone);
    reset();
    startScan(phone);

    let localTime = new Date();
    let progressVal = 0;

    // Packet interval
    packetIntervalRef.current = setInterval(() => {
      if (!usePhoneScanStore.getState().isScanning) {
        console.log('Scanning stopped, clearing packet interval');
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

      // Update status occasionally
      if (packets.length % 5 === 0) {
        const statuses = [
          'Sniffing network traffic...',
          'Decrypting handshake...',
          'Triangulating cell towers...',
          'Extracting metadata...',
          'Building packet timeline...',
          'Deep packet inspection...',
        ];
        setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 500);

    // Progress interval
    progressIntervalRef.current = setInterval(() => {
      progressVal += 1;
      setProgress(Math.min(progressVal, 100));
      if (progressVal >= 100) {
        console.log('Scan complete, generating report');
        clearInterval(packetIntervalRef.current!);
        clearInterval(progressIntervalRef.current!);
        stopScan();
        const result = buildFinalReport(phone, discoveredCalls, discoveredMessages, discoveredContacts);
        completeScan(result);
        setStatus('Scan complete – report ready');
      }
    }, (SCAN_DURATION * 1000) / 100);
  };

  const handleStopScan = () => {
    console.log('Stop scan clicked');
    if (packetIntervalRef.current) clearInterval(packetIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    stopScan();
    setStatus('Scan aborted');
  };

  useEffect(() => {
    return () => {
      if (packetIntervalRef.current) clearInterval(packetIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <div className="p-4 text-green-400">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter Ugandan phone (e.g., 0755123456)"
          className="flex-1 p-2 bg-black border border-green-500 text-green-400 focus:outline-none"
          disabled={isScanning}
        />
        {!isScanning ? (
          <button
            onClick={handleStartScan}
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition"
          >
            INITIATE DEEP SCAN
          </button>
        ) : (
          <button
            onClick={handleStopScan}
            className="px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition"
          >
            ABORT
          </button>
        )}
        <button onClick={reset} className="px-4 py-2 border border-gray-500 hover:bg-gray-500 hover:text-black">
          CLEAR
        </button>
      </div>

      {isScanning && (
        <div className="mb-4">
          <div className="flex justify-between text-xs">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-black border border-green-500">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="border border-green-500 p-2 h-64 overflow-y-auto bg-black/80 font-mono text-xs">
        {packets.length === 0 && !isScanning && (
          <div className="text-green-600">Awaiting scan initiation...</div>
        )}
        {packets.map((p, idx) => (
          <div key={idx} className="border-b border-green-500/20 py-1">
            <span className="text-green-300">{p.timestamp}</span>
            <span className="ml-2 text-green-500">[{p.type.toUpperCase()}]</span>
            <span className="ml-2 text-green-400">{p.data}</span>
            <span className="ml-2 text-green-600 break-all">[Base64: {p.base64.substring(0, 20)}...]</span>
          </div>
        ))}
        <div ref={packetsEndRef} />
      </div>

      {scanResult && (
        <div className="mt-4 space-y-4 border-t border-green-500 pt-4">
          <h3 className="text-lg font-bold">📡 SCAN REPORT – {scanResult.phoneNumber}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-2">
              <h4>📍 Coordinates</h4>
              <p>{scanResult.coordinates.lat}, {scanResult.coordinates.lng}</p>
              <a href={`https://www.google.com/maps?q=${scanResult.coordinates.lat},${scanResult.coordinates.lng}`} target="_blank" className="text-blue-400 underline">View Map</a>
              <p className="text-xs text-green-600">Last ping: {scanResult.coordinates.timestamp}</p>
            </div>
            <div className="border p-2">
              <h4>📱 Installed Apps</h4>
              <ul className="list-disc pl-4">
                {scanResult.installedApps.map(app => <li key={app}>{app}</li>)}
              </ul>
            </div>
          </div>

          <div className="border p-2">
            <h4>📞 Calls ({scanResult.calls.length})</h4>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-xs">
                <thead><tr><th>Dir</th><th>Number</th><th>Duration</th><th>Time</th></tr></thead>
                <tbody>
                  {scanResult.calls.map((call, i) => (
                    <tr key={i} className="border-t border-green-500/20">
                      <td>{call.direction}</td>
                      <td>{call.number}</td>
                      <td>{call.duration}s</td>
                      <td>{call.date.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border p-2">
            <h4>💬 Messages ({scanResult.messages.length})</h4>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-xs">
                <thead><tr><th>Direction</th><th>Content</th><th>Time</th></tr></thead>
                <tbody>
                  {scanResult.messages.map((msg, i) => (
                    <tr key={i} className="border-t border-green-500/20">
                      <td>{msg.direction}</td>
                      <td>{msg.text}</td>
                      <td>{msg.timestamp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border p-2">
            <h4>🔗 Associated Numbers</h4>
            <div className="flex flex-wrap gap-2">
              {scanResult.associatedNumbers.map((assoc, i) => (
                <span key={i} className="bg-green-900/30 px-2 py-1 border border-green-500 text-xs">
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
