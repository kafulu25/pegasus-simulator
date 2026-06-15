import React, { useState, useEffect, useRef } from 'react';
import './OsintPanel.css';

interface OsintTab {
  id: string;
  name: string;
  icon: string;
}

// 2 hours in milliseconds = 7200000 ms
// For simulation, we'll make progress increments proportionally
const SIMULATION_DURATION_MS = 7200000; // 2 hours
const PROGRESS_INCREMENT = 0.001; // Very slow progress

export const OsintPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('sherlock');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  // Sherlock OSINT States
  const [username, setUsername] = useState('');
  const [sherlockResults, setSherlockResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // TikTok specific results
  const [tiktokResults, setTiktokResults] = useState<any[]>([]);
  
  // Geolocation States
  const [geoInput, setGeoInput] = useState('');
  const [geoInputType, setGeoInputType] = useState<'coordinates' | 'ip'>('coordinates');
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [ipInfo, setIpInfo] = useState<any>(null);
  
  // Base64 States
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  
  // Brute Force States
  const [bruteForceTarget, setBruteForceTarget] = useState('');
  const [bruteForceProgress, setBruteForceProgress] = useState(0);
  const [bruteForceRunning, setBruteForceRunning] = useState(false);
  const [bruteForceFound, setBruteForceFound] = useState<string | null>(null);
  const bruteForceInterval = useRef<NodeJS.Timeout | null>(null);
  const bruteForceStartTime = useRef<number>(0);
  
  // MITM States
  const [mitmTarget, setMitmTarget] = useState('');
  const [mitmProgress, setMitmProgress] = useState(0);
  const [mitmRunning, setMitmRunning] = useState(false);
  const [mitmStatus, setMitmStatus] = useState('');
  const mitmInterval = useRef<NodeJS.Timeout | null>(null);
  const mitmStartTime = useRef<number>(0);
  
  // Payload States
  const [payloadType, setPayloadType] = useState<'ios' | 'apk' | 'exe' | 'pdf' | 'doc'>('ios');
  const [payloadProgress, setPayloadProgress] = useState(0);
  const [payloadRunning, setPayloadRunning] = useState(false);
  const [payloadUrl, setPayloadUrl] = useState<string | null>(null);
  const payloadInterval = useRef<NodeJS.Timeout | null>(null);
  const payloadStartTime = useRef<number>(0);
  
  const tabs: OsintTab[] = [
    { id: 'sherlock', name: 'OSINT', icon: '🔍' },
    { id: 'geolocation', name: 'Geolocation & IP Tracker', icon: '📍' },
    { id: 'base64', name: 'Base64 Decoder/Encoder', icon: '📝' },
    { id: 'bruteforce', name: 'Brute Force', icon: '🔐' },
    { id: 'mitm', name: 'MITM', icon: '🌐' },
    { id: 'payload', name: 'Payload Generator', icon: '💀' },
  ];
  
  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (bruteForceInterval.current) clearInterval(bruteForceInterval.current);
      if (mitmInterval.current) clearInterval(mitmInterval.current);
      if (payloadInterval.current) clearInterval(payloadInterval.current);
    };
  }, []);
  
  // ============ SHERLOCK OSINT SIMULATION with TikTok ============
  const platforms = [
    { name: 'GitHub', url: 'https://github.com/', exists: true },
    { name: 'Twitter', url: 'https://twitter.com/', exists: true },
    { name: 'Instagram', url: 'https://instagram.com/', exists: true },
    { name: 'Facebook', url: 'https://facebook.com/', exists: false },
    { name: 'Reddit', url: 'https://reddit.com/', exists: true },
    { name: 'LinkedIn', url: 'https://linkedin.com/', exists: false },
    { name: 'YouTube', url: 'https://youtube.com/', exists: true },
    { name: 'TikTok', url: 'https://tiktok.com/@', exists: true },
    { name: 'Telegram', url: 'https://t.me/', exists: true },
    { name: 'Discord', url: 'https://discord.com/', exists: false },
    { name: 'Pinterest', url: 'https://pinterest.com/', exists: true },
    { name: 'Tumblr', url: 'https://tumblr.com/', exists: false },
  ];
  
  // Mock TikTok user data for search results
  const getTikTokResults = (searchUsername: string) => {
    return [
      {
        username: searchUsername,
        displayName: `${searchUsername} Official`,
        followers: Math.floor(Math.random() * 1000000),
        following: Math.floor(Math.random() * 5000),
        videos: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 5000000),
        verified: Math.random() > 0.8,
        bio: `Content creator | ${Math.random() > 0.5 ? '🎵 Music' : '📸 Lifestyle'} | ${Math.random() > 0.5 ? '✨ New videos daily' : '🌟 Follow for more'}`,
        url: `https://tiktok.com/@${searchUsername}`,
        profileImage: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`
      },
      {
        username: `${searchUsername}_real`,
        displayName: `${searchUsername} Real`,
        followers: Math.floor(Math.random() * 500000),
        following: Math.floor(Math.random() * 2000),
        videos: Math.floor(Math.random() * 300),
        likes: Math.floor(Math.random() * 2000000),
        verified: false,
        bio: `Just being myself | ${Math.random() > 0.5 ? '🎮 Gamer' : '✈️ Traveler'}`,
        url: `https://tiktok.com/@${searchUsername}_real`,
        profileImage: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`
      },
      {
        username: `${searchUsername}.official`,
        displayName: `${searchUsername} • Official`,
        followers: Math.floor(Math.random() * 2000000),
        following: Math.floor(Math.random() * 1000),
        videos: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 10000000),
        verified: true,
        bio: `Verified Account | ${Math.random() > 0.5 ? '🏆 Award Winner' : '⭐ Top Creator'}`,
        url: `https://tiktok.com/@${searchUsername}.official`,
        profileImage: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`
      }
    ];
  };
  
  const runSherlockOSINT = async () => {
    if (!username.trim()) {
      alert('Please enter a username to search');
      return;
    }
    
    setIsSearching(true);
    setSherlockResults([]);
    setTiktokResults([]);
    
    const results: any[] = [];
    
    // Simulate scanning each platform with delay
    for (let i = 0; i < platforms.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      const platform = platforms[i];
      const exists = Math.random() > 0.6;
      
      if (exists) {
        results.push({
          platform: platform.name,
          url: `${platform.url}${username}`,
          status: 'found',
          timestamp: new Date().toISOString()
        });
      }
      
      setSherlockResults([...results]);
    }
    
    // Get TikTok specific results
    const tiktokUserResults = getTikTokResults(username);
    setTiktokResults(tiktokUserResults);
    
    setIsSearching(false);
  };
  
  // ============ GEOLOCATION & IP TRACKER ============
  const resolveIPToCoordinates = (ip: string): { lat: number; lng: number; city: string; country: string } | null => {
    const ipDatabase: Record<string, { lat: number; lng: number; city: string; country: string }> = {
      '8.8.8.8': { lat: 37.7749, lng: -122.4194, city: 'Mountain View', country: 'USA' },
      '1.1.1.1': { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
      '185.165.29.182': { lat: 35.6892, lng: 51.3890, city: 'Tehran', country: 'Iran' },
      '192.168.1.1': { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
    };
    
    return ipDatabase[ip] || { lat: 35.6892, lng: 51.3890, city: 'Unknown', country: 'Unknown' };
  };
  
  const handleGeoLookup = () => {
    if (!geoInput.trim()) {
      alert('Please enter coordinates or IP address');
      return;
    }
    
    if (geoInputType === 'coordinates') {
      const parts = geoInput.split(',').map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setGeoLocation({ lat: parts[0], lng: parts[1] });
        setIpInfo(null);
      } else {
        alert('Invalid coordinates format. Use: latitude, longitude');
      }
    } else {
      const info = resolveIPToCoordinates(geoInput);
      if (info) {
        setGeoLocation({ lat: info.lat, lng: info.lng });
        setIpInfo(info);
      } else {
        alert('IP address not found in database');
      }
    }
  };
  
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setGeoInput(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          alert('Unable to get location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  };
  
  // ============ BASE64 ENCODER/DECODER ============
  const handleBase64Convert = () => {
    if (!base64Input.trim()) {
      alert('Please enter text to encode/decode');
      return;
    }
    
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (error) {
      alert('Invalid Base64 string for decoding');
    }
  };
  
  const clearBase64 = () => {
    setBase64Input('');
    setBase64Output('');
  };
  
  // ============ BRUTE FORCE SIMULATION (2 HOURS) ============
  const startBruteForce = () => {
    if (!bruteForceTarget.trim()) {
      alert('Please enter a target username/hash');
      return;
    }
    
    setBruteForceRunning(true);
    setBruteForceProgress(0);
    setBruteForceFound(null);
    bruteForceStartTime.current = Date.now();
    
    bruteForceInterval.current = setInterval(() => {
      const elapsed = Date.now() - bruteForceStartTime.current;
      const progressValue = Math.min((elapsed / SIMULATION_DURATION_MS) * 100, 99.9);
      
      if (elapsed >= SIMULATION_DURATION_MS) {
        clearInterval(bruteForceInterval.current!);
        setBruteForceRunning(false);
        setBruteForceProgress(100);
        const foundPasswords = ['password123', 'admin2024', 'qwerty123', 'letmein', 'secret123'];
        setBruteForceFound(foundPasswords[Math.floor(Math.random() * foundPasswords.length)]);
      } else {
        setBruteForceProgress(progressValue);
      }
    }, 1000); // Update every second
  };
  
  const stopBruteForce = () => {
    if (bruteForceInterval.current) {
      clearInterval(bruteForceInterval.current);
      setBruteForceRunning(false);
      setBruteForceProgress(0);
    }
  };
  
  // ============ MITM SIMULATION (2 HOURS) ============
  const startMITM = () => {
    if (!mitmTarget.trim()) {
      alert('Please enter a target IP or domain');
      return;
    }
    
    setMitmRunning(true);
    setMitmProgress(0);
    mitmStartTime.current = Date.now();
    
    const stages = [
      'Initializing attack vectors...',
      'ARP poisoning in progress...',
      'Capturing network traffic...',
      'SSL stripping enabled...',
      'Intercepting packets...',
      'Decrypting HTTPS traffic...',
      'Extracting session tokens...',
      'Dumping captured data...',
      'Finalizing attack...'
    ];
    
    let lastStageIndex = -1;
    
    mitmInterval.current = setInterval(() => {
      const elapsed = Date.now() - mitmStartTime.current;
      const progressValue = Math.min((elapsed / SIMULATION_DURATION_MS) * 100, 99.9);
      
      const stageIndex = Math.floor((progressValue / 100) * stages.length);
      if (stageIndex > lastStageIndex && stageIndex < stages.length) {
        setMitmStatus(stages[stageIndex]);
        lastStageIndex = stageIndex;
      }
      
      if (elapsed >= SIMULATION_DURATION_MS) {
        clearInterval(mitmInterval.current!);
        setMitmRunning(false);
        setMitmProgress(100);
        setMitmStatus('MITM Attack Complete! Session hijacked.');
      } else {
        setMitmProgress(progressValue);
      }
    }, 1000);
  };
  
  const stopMITM = () => {
    if (mitmInterval.current) {
      clearInterval(mitmInterval.current);
      setMitmRunning(false);
      setMitmProgress(0);
      setMitmStatus('');
    }
  };
  
  // ============ PAYLOAD GENERATOR (2 HOURS) ============
  const generatePayload = () => {
    setPayloadRunning(true);
    setPayloadProgress(0);
    setPayloadUrl(null);
    payloadStartTime.current = Date.now();
    
    payloadInterval.current = setInterval(() => {
      const elapsed = Date.now() - payloadStartTime.current;
      const progressValue = Math.min((elapsed / SIMULATION_DURATION_MS) * 100, 99.9);
      
      if (elapsed >= SIMULATION_DURATION_MS) {
        clearInterval(payloadInterval.current!);
        setPayloadRunning(false);
        setPayloadProgress(100);
        
        // Different payload URLs for different types
        const payloadUrls: Record<string, string[]> = {
          ios: [
            `https://enterprise-signer.xyz/ipa/pegasus_${Date.now()}.ipa`,
            `https://testflight.download/pegasus_agent_${Date.now()}.ipa`,
            `https://ios-deploy.com/payloads/peg_${Date.now()}.ipa`,
            `itms-services://?action=download-manifest&url=https://deploy.ios/peg.plist`
          ],
          apk: [
            `https://malicious-server.xyz/apk/pegasus_${Date.now()}.apk`,
            `https://drive.google.com/uc?id=${Math.random().toString(36).substring(7)}`,
            `https://short.link/${Math.random().toString(36).substring(2, 8)}.apk`,
            `https://payload-server.net/download.php?id=${Date.now()}&type=apk`
          ],
          exe: [
            `https://malicious-server.xyz/exe/pegasus_${Date.now()}.exe`,
            `https://drive.google.com/uc?id=${Math.random().toString(36).substring(7)}`,
            `https://short.link/${Math.random().toString(36).substring(2, 8)}.exe`,
            `https://payload-server.net/download.php?id=${Date.now()}&type=exe`
          ],
          pdf: [
            `https://malicious-server.xyz/pdf/exploit_${Date.now()}.pdf`,
            `https://drive.google.com/uc?id=${Math.random().toString(36).substring(7)}`,
            `https://short.link/${Math.random().toString(36).substring(2, 8)}.pdf`,
            `https://payload-server.net/download.php?id=${Date.now()}&type=pdf`
          ],
          doc: [
            `https://malicious-server.xyz/doc/macro_${Date.now()}.docx`,
            `https://drive.google.com/uc?id=${Math.random().toString(36).substring(7)}`,
            `https://short.link/${Math.random().toString(36).substring(2, 8)}.docx`,
            `https://payload-server.net/download.php?id=${Date.now()}&type=doc`
          ]
        };
        
        const urls = payloadUrls[payloadType];
        setPayloadUrl(urls[Math.floor(Math.random() * urls.length)]);
      } else {
        setPayloadProgress(progressValue);
      }
    }, 200); // Update every 200ms for smoother animation
  };
  
  const stopPayload = () => {
    if (payloadInterval.current) {
      clearInterval(payloadInterval.current);
      setPayloadRunning(false);
      setPayloadProgress(0);
      setPayloadUrl(null);
    }
  };
  
  const copyPayloadUrl = () => {
    if (payloadUrl) {
      navigator.clipboard.writeText(payloadUrl);
      alert('Payload URL copied to clipboard!');
    }
  };
  
  const formatTimeRemaining = (progress: number): string => {
    const remainingPercent = 100 - progress;
    const remainingMs = (remainingPercent / 100) * SIMULATION_DURATION_MS;
    const remainingMinutes = Math.floor(remainingMs / 60000);
    const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
    return `${remainingMinutes}m ${remainingSeconds}s`;
  };
  
  // ============ RENDER FUNCTIONS ============
  const renderSherlockTab = () => (
    <div className="osint-tab-content">
      <div className="osint-description">
        <p>OSINT (Open Source Intelligence) - Username enumeration across multiple platforms</p>
        <p><strong>Search for a username across social networks</strong></p>
      </div>
      
      <div className="osint-input-group">
        <input
          type="text"
          className="osint-input"
          placeholder="Enter username to search "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSearching}
        />
        <button 
          className={`osint-btn ${isSearching ? 'disabled' : 'primary'}`}
          onClick={runSherlockOSINT}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Run  OSINT'}
        </button>
      </div>
      
      {isSearching && (
        <div className="osint-loading">
          <div className="spinner"></div>
          <p>Scanning platforms...</p>
        </div>
      )}
      
      {/* TikTok Specific Results */}
      {tiktokResults.length > 0 && (
        <div className="osint-results tiktok-results">
          <h4>🎵 TikTok Search Results for "@{username}":</h4>
          <div className="tiktok-results-grid">
            {tiktokResults.map((result, idx) => (
              <div key={idx} className="tiktok-result-card">
                <div className="tiktok-header">
                  <span className="tiktok-username">{result.username}</span>
                  {result.verified && <span className="verified-badge">✓ Verified</span>}
                </div>
                <div className="tiktok-stats">
                  <span>👥 {result.followers.toLocaleString()} followers</span>
                  <span>📹 {result.videos} videos</span>
                  <span>❤️ {result.likes.toLocaleString()} likes</span>
                </div>
                <div className="tiktok-bio">{result.bio}</div>
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-link">
                  View TikTok Profile →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Platform Search Results */}
      {sherlockResults.length > 0 && (
        <div className="osint-results">
          <h4>✅ Found on {sherlockResults.length} platforms:</h4>
          <div className="results-grid">
            {sherlockResults.map((result, idx) => (
              <div key={idx} className="result-item">
                <span className="result-platform">{result.platform}</span>
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-link">
                  View Profile →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  const renderGeolocationTab = () => (
    <div className="osint-tab-content">
      <div className="osint-description">
        <p>Geolocation & IP Tracker - Convert coordinates or IP addresses to location</p>
      </div>
      
      <div className="geo-input-group">
        <div className="geo-type-selector">
          <button 
            className={`geo-type-btn ${geoInputType === 'coordinates' ? 'active' : ''}`}
            onClick={() => setGeoInputType('coordinates')}
          >
            Coordinates
          </button>
          <button 
            className={`geo-type-btn ${geoInputType === 'ip' ? 'active' : ''}`}
            onClick={() => setGeoInputType('ip')}
          >
            IP Address
          </button>
        </div>
        
        <div className="osint-input-group">
          <input
            type="text"
            className="osint-input"
            placeholder={geoInputType === 'coordinates' ? '35.6892, 51.3890' : '185.165.29.182'}
            value={geoInput}
            onChange={(e) => setGeoInput(e.target.value)}
          />
          <button className="osint-btn primary" onClick={handleGeoLookup}>
            Locate
          </button>
          <button className="osint-btn secondary" onClick={useCurrentLocation}>
            My Location
          </button>
        </div>
      </div>
      
      {geoLocation && (
        <div className="geo-results">
          <div className="map-container-osint">
            <iframe
              src={`https://maps.google.com/maps?q=${geoLocation.lat},${geoLocation.lng}&z=15&output=embed`}
              title="Location Map"
              width="100%"
              height="300"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          <div className="location-details">
            <p><strong>Coordinates:</strong> {geoLocation.lat.toFixed(6)}°, {geoLocation.lng.toFixed(6)}°</p>
            {ipInfo && (
              <>
                <p><strong>IP Address:</strong> {geoInput}</p>
                <p><strong>City:</strong> {ipInfo.city}</p>
                <p><strong>Country:</strong> {ipInfo.country}</p>
              </>
            )}
            <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderBase64Tab = () => (
    <div className="osint-tab-content">
      <div className="osint-description">
        <p>Base64 Encoder/Decoder - Convert text to Base64 and vice versa</p>
      </div>
      
      <div className="base64-mode-selector">
        <button 
          className={`base64-mode-btn ${base64Mode === 'encode' ? 'active' : ''}`}
          onClick={() => { setBase64Mode('encode'); setBase64Output(''); }}
        >
          Encode to Base64
        </button>
        <button 
          className={`base64-mode-btn ${base64Mode === 'decode' ? 'active' : ''}`}
          onClick={() => { setBase64Mode('decode'); setBase64Output(''); }}
        >
          Decode from Base64
        </button>
      </div>
      
      <div className="base64-input-area">
        <textarea
          className="base64-textarea"
          rows={5}
          placeholder={base64Mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
        />
      </div>
      
      <div className="osint-button-group">
        <button className="osint-btn primary" onClick={handleBase64Convert}>
          {base64Mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button className="osint-btn secondary" onClick={clearBase64}>
          Clear
        </button>
      </div>
      
      {base64Output && (
        <div className="base64-output">
          <h4>{base64Mode === 'encode' ? 'Base64 Encoded:' : 'Decoded Text:'}</h4>
          <div className="output-content">{base64Output}</div>
          <button 
            className="copy-btn"
            onClick={() => { navigator.clipboard.writeText(base64Output); alert('Copied!'); }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
  
  const renderBruteForceTab = () => (
    <div className="osint-tab-content">
      <div className="osint-description">
        <p>🔐 Brute Force - Password cracking</p>
       
      </div>
      
      <div className="osint-input-group">
        <input
          type="text"
          className="osint-input"
          placeholder="Enter target username/hash (simulated)"
          value={bruteForceTarget}
          onChange={(e) => setBruteForceTarget(e.target.value)}
          disabled={bruteForceRunning}
        />
      </div>
      
      {bruteForceRunning && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${bruteForceProgress}%` }}></div>
          </div>
          <p className="progress-text">Cracking password... {Math.floor(bruteForceProgress)}% complete</p>
          <p className="time-remaining">Estimated time remaining: {formatTimeRemaining(bruteForceProgress)}</p>
          <div className="terminal-animation">
            <span className="terminal-line">{`[*] Trying combination #${Math.floor(Math.random() * 999999)}`}</span>
            <span className="terminal-line">{`[*] Testing password: ${['admin', 'password', '123456', 'qwerty'][Math.floor(Math.random() * 4)]}***`}</span>
            <span className="terminal-line">{`[*] Hash rate: ${Math.floor(Math.random() * 1000)} H/s`}</span>
          </div>
        </div>
      )}
      
      {bruteForceFound && (
        <div className="success-result">
          <p>✅ Password Found: <strong>{bruteForceFound}</strong></p>
          <p>Time taken: Few hours</p>
        </div>
      )}
      
      <div className="osint-button-group">
        {!bruteForceRunning ? (
          <button className="osint-btn primary" onClick={startBruteForce}>
            Start Brute Force
          </button>
        ) : (
          <button className="osint-btn danger" onClick={stopBruteForce}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
  
  const renderMITMTab = () => (
    <div className="osint-tab-content">
      <div className="osint-description">
        <p>🌐 MITM (Man-In-The-Middle) Attack - Network interception</p>
      </div>
      
      <div className="osint-input-group">
        <input
          type="text"
          className="osint-input"
          placeholder="Enter target IP or domain (e.g., 192.168.1.1 or google.com)"
          value={mitmTarget}
          onChange={(e) => setMitmTarget(e.target.value)}
          disabled={mitmRunning}
        />
      </div>
      
      {mitmRunning && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${mitmProgress}%` }}></div>
          </div>
          <p className="progress-text">MITM Attack Progress: {Math.floor(mitmProgress)}%</p>
          <p className="time-remaining">Estimated time remaining: {formatTimeRemaining(mitmProgress)}</p>
          {mitmStatus && <p className="mitm-status">{mitmStatus}</p>}
          <div className="terminal-animation">
            <span className="terminal-line">{`[*] Sniffing packets from ${mitmTarget}`}</span>
            <span className="terminal-line">{`[*] Captured ${Math.floor(Math.random() * 100)} packets`}</span>
            <span className="terminal-line">{`[*] Session ID intercepted: ${Math.random().toString(36).substring(7)}`}</span>
          </div>
        </div>
      )}
      
      {mitmProgress === 100 && (
        <div className="success-result">
          <p>✅ MITM Attack Completed!</p>
          <p>Session token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
          <p>Captured data logged to /var/log/mitm_capture.log</p>
        </div>
      )}
      
      <div className="osint-button-group">
        {!mitmRunning ? (
          <button className="osint-btn primary" onClick={startMITM}>
            Start MITM Attack
          </button>
        ) : (
          <button className="osint-btn danger" onClick={stopMITM}>
            Stop Attack
          </button>
        )}
      </div>
    </div>
  );
  
  const renderPayloadTab = () => (
    <div className="osint-tab-content">
      <div className="osint-description">
        <p>💀 Payload Generator - Create malicious payloads</p>
       
      </div>
      
      <div className="payload-options">
        <label>Select Payload Type:</label>
        <div className="payload-type-selector">
          <button 
            className={`payload-type-btn ${payloadType === 'ios' ? 'active' : ''}`}
            onClick={() => setPayloadType('ios')}
            disabled={payloadRunning}
          >
            🍎 iOS (IPA)
          </button>
          <button 
            className={`payload-type-btn ${payloadType === 'apk' ? 'active' : ''}`}
            onClick={() => setPayloadType('apk')}
            disabled={payloadRunning}
          >
            🤖 Android (APK)
          </button>
          <button 
            className={`payload-type-btn ${payloadType === 'exe' ? 'active' : ''}`}
            onClick={() => setPayloadType('exe')}
            disabled={payloadRunning}
          >
            💻 Windows (EXE)
          </button>
          <button 
            className={`payload-type-btn ${payloadType === 'pdf' ? 'active' : ''}`}
            onClick={() => setPayloadType('pdf')}
            disabled={payloadRunning}
          >
            📄 PDF Exploit
          </button>
          <button 
            className={`payload-type-btn ${payloadType === 'doc' ? 'active' : ''}`}
            onClick={() => setPayloadType('doc')}
            disabled={payloadRunning}
          >
            📝 Word Document
          </button>
        </div>
      </div>
      
      {payloadRunning && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${payloadProgress}%` }}></div>
          </div>
          <p className="progress-text">Generating payload... {Math.floor(payloadProgress)}%</p>
          <p className="time-remaining">Estimated time remaining: {formatTimeRemaining(payloadProgress)}</p>
          <div className="terminal-animation">
            {payloadType === 'ios' && (
              <>
                <span className="terminal-line">[*] Bypassing iOS code signing requirements...</span>
                <span className="terminal-line">[*] Injecting persistence via MDM profile</span>
                <span className="terminal-line">[*] Encrypting IPA with FairPlay DRM bypass</span>
                <span className="terminal-line">[*] Setting up C2 communication via APNs</span>
              </>
            )}
            {payloadType === 'apk' && (
              <>
                <span className="terminal-line">[*] Obfuscating DEX bytecode...</span>
                <span className="terminal-line">[*] Embedding exploit in AndroidManifest.xml</span>
                <span className="terminal-line">[*] Signing APK with test key</span>
                <span className="terminal-line">[*] Setting up C2 communication channel</span>
              </>
            )}
            {payloadType === 'exe' && (
              <>
                <span className="terminal-line">[*] Encrypting payload with AES-256</span>
                <span className="terminal-line">[*] Obfuscating PE headers...</span>
                <span className="terminal-line">[*] Setting up C2 communication channel</span>
                <span className="terminal-line">[*] Packing final executable</span>
              </>
            )}
            {(payloadType === 'pdf' || payloadType === 'doc') && (
              <>
                <span className="terminal-line">[*] Embedding JavaScript exploit</span>
                <span className="terminal-line">[*] Obfuscating macro code...</span>
                <span className="terminal-line">[*] Setting up dropper mechanism</span>
                <span className="terminal-line">[*] Packaging document with payload</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {payloadUrl && (
        <div className="payload-result">
          <p>✅ Payload Generated Successfully!</p>
          <div className="payload-url-container">
            <input type="text" className="payload-url" value={payloadUrl} readOnly />
            <button className="copy-btn" onClick={copyPayloadUrl}>Copy Link</button>
          </div>
          <p className="payload-note">
            {payloadType === 'ios' && '⚠️ This IPA requires enterprise signing. Target must have "Trust Enterprise Developer" enabled.'}
            {payloadType === 'apk' && '⚠️ Share this APK file with target. Installation requires "Unknown Sources" enabled.'}
            {payloadType === 'exe' && '⚠️ Share this executable with target. May trigger antivirus warnings.'}
            {(payloadType === 'pdf' || payloadType === 'doc') && '⚠️ Share this document with target. Requires enabling macros.'}
          </p>
        </div>
      )}
      
      <div className="osint-button-group">
        {!payloadRunning ? (
          <button className="osint-btn primary" onClick={generatePayload}>
            Generate Payload
          </button>
        ) : (
          <button className="osint-btn danger" onClick={stopPayload}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="osint-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🔍</span> OSINT Intelligence Suite
          </div>
          <div className="panel-subtitle">Open Source Intelligence Tools & Security Testing Tools</div>
        </div>
      </div>
      
      <div className="osint-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`osint-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>
      
      <div className="osint-content">
        {activeTab === 'sherlock' && renderSherlockTab()}
        {activeTab === 'geolocation' && renderGeolocationTab()}
        {activeTab === 'base64' && renderBase64Tab()}
        {activeTab === 'bruteforce' && renderBruteForceTab()}
        {activeTab === 'mitm' && renderMITMTab()}
        {activeTab === 'payload' && renderPayloadTab()}
      </div>
    </div>
  );
};