import React, { useState, useEffect, useRef } from 'react';
import './ExpertMode.css';

interface Task {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  output: string[];
  target?: string;
}

// Global store outside React component - persists across tab switches
let globalState = {
  isActive: false,
  tasks: [
    { id: 1, name: 'Initializing Connection', status: 'pending', progress: 0, output: [] },
    { id: 2, name: 'Bypassing Firewall', status: 'pending', progress: 0, output: [] },
    { id: 3, name: 'Establishing Secure Tunnel', status: 'pending', progress: 0, output: [] },
    { id: 4, name: 'Enumerating Target Network', status: 'pending', progress: 0, output: [] },
    { id: 5, name: 'Extracting Credentials', status: 'pending', progress: 0, output: [] },
    { id: 6, name: 'Dumping Database', status: 'pending', progress: 0, output: [] },
    { id: 7, name: 'Capturing Traffic', status: 'pending', progress: 0, output: [] },
    { id: 8, name: 'Finalizing Exploitation', status: 'pending', progress: 0, output: [] },
  ],
  globalLog: [] as string[],
  connectionStats: { packets: 0, bytes: 0, connections: 0, latency: 0 },
  internetSpeed: 0,
  serversConnected: 0,
  currentOperation: 'Idle',
  currentTarget: '185.165.29.182'
};

// Global intervals
let globalInterval: NodeJS.Timeout | null = null;
let globalLogInterval: NodeJS.Timeout | null = null;
let isTaskRunning = false;
let currentTaskIndex = 0;
let taskOutputIntervals: NodeJS.Timeout[] = [];
let taskProgressIntervals: NodeJS.Timeout[] = [];

// Callback for component updates
let forceUpdateCallback: (() => void) | null = null;

const consoleMessages = [
  '✅ Payload injected successfully into target device',
  'ℹ️ Loading exploit modules...',
  '⚠️ Signal failure detected - retrying connection',
  '✅ Zero-click exploit successful',
  'ℹ️ Encrypted channel established',
  '✅ Extracting SMS messages from device',
  'ℹ️ SMS Database: 2,847 messages found',
  '✅ Identifying location via cell towers',
  'ℹ️ GPS coordinates: 35.6892° N, 51.3890° E',
  '✅ Extracting call logs from target device',
  'ℹ️ Incoming call detected: +98 21 *** 4782 (Duration: 8m 22s)',
  'ℹ️ Outgoing call detected: +989123456789 (Duration: 3m 11s)',
  '✅ Call recording saved to archive',
  'ℹ️ Encoded message: VGhlIGRvY3VtZW50cyBhcmUgcmVhZHk=',
  '✅ Decoded: "The documents are ready"',
  'ℹ️ Tracking device location...',
  '✅ Location updated: Tehran, Iran (35.6892° N, 51.3890° E)',
  '✅ IP Address resolved: 185.165.29.182',
  'ℹ️ Accessing WhatsApp database...',
  '✅ WhatsApp messages extracted: 12,447',
  '✅ Password extracted: Gmail - a.karimi@gmail.com',
  'ℹ️ Battery level: 72%',
  '✅ Persistence established - Agent will survive reboot',
];

const taskOutputs: Record<number, string[]> = {
  1: ['Handshake established', 'TLS 1.3 negotiation complete', 'Session key exchanged', 'Connection secured'],
  2: ['Bypassing IDS/IPS...', 'Firewall rule bypassed', 'Port knocking successful', 'WAF evasion detected'],
  3: ['OpenVPN tunnel established', 'SSH tunnel created', 'Traffic encrypted with AES-256', 'Perfect forward secrecy enabled'],
  4: ['Scanning subnet /24...', '6 hosts discovered', 'Open ports: 22, 80, 443, 3306', 'Service enumeration complete'],
  5: ['Hash extraction in progress', 'Brute forcing NTLM hashes', 'Password found: admin123', 'Token captured'],
  6: ['Dumping MySQL database...', 'Table: users (247 rows)', 'Table: messages (1,892 rows)', 'Archive created: dump.sql'],
  7: ['Promiscuous mode enabled', 'Capturing 1.2 MB/s', 'SSL stripping active', 'Session cookie intercepted'],
  8: ['Persistence established', 'Backdoor deployed', 'Cleaning logs...', 'Exploitation complete']
};

function addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  globalState.globalLog = [`[${timestamp}] ${icons[type]} ${message}`, ...globalState.globalLog].slice(0, 20000);
  forceUpdateCallback?.();
}

function updateTask(id: number, updates: Partial<Task>) {
  const taskIndex = globalState.tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    globalState.tasks[taskIndex] = { ...globalState.tasks[taskIndex], ...updates };
    forceUpdateCallback?.();
  }
}

function runTaskSequential() {
  if (!globalState.isActive) return;
  if (currentTaskIndex >= globalState.tasks.length) {
    addLog('🎯 Operation Complete! Full access acquired.', 'success');
    addLog('🔐 Credentials extracted and stored securely.', 'success');
    globalState.currentOperation = 'Access Granted';
    forceUpdateCallback?.();
    return;
  }
  
  const task = globalState.tasks[currentTaskIndex];
  updateTask(task.id, { status: 'running', progress: 0, output: [] });
  addLog(`Starting: ${task.name}`, 'info');
  
  let outputIndex = 0;
  let progress = 0;
  
  const outputTimer = setInterval(() => {
    if (outputIndex < taskOutputs[task.id].length && globalState.isActive) {
      const currentTask = globalState.tasks[currentTaskIndex];
      updateTask(task.id, { output: [...currentTask.output, taskOutputs[task.id][outputIndex]] });
      addLog(`[${task.name}] ${taskOutputs[task.id][outputIndex]}`, 'info');
      outputIndex++;
    } else if (outputIndex >= taskOutputs[task.id].length) {
      clearInterval(outputTimer);
    }
  }, 600);
  taskOutputIntervals.push(outputTimer);
  
  const progressTimer = setInterval(() => {
    if (progress < 100 && globalState.isActive) {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      updateTask(task.id, { progress: Math.min(progress, 100) });
    } else {
      clearInterval(progressTimer);
      updateTask(task.id, { status: 'completed' });
      addLog(`✓ Completed: ${task.name}`, 'success');
      currentTaskIndex++;
      runTaskSequential();
    }
  }, 200);
  taskProgressIntervals.push(progressTimer);
}

function startGlobalSimulation() {
  if (globalState.isActive) return;
  
  globalState.isActive = true;
  globalState.globalLog = [];
  globalState.serversConnected = 12;
  globalState.currentTarget = '185.165.29.182';
  globalState.tasks = globalState.tasks.map(task => ({ ...task, status: 'pending', progress: 0, output: [] }));
  currentTaskIndex = 0;
  
  addLog('🚀 Pegasus Expert Mode Activated', 'success');
  addLog(`Target: ${globalState.currentTarget}`, 'info');
  addLog('Initiating attack vectors...', 'info');
  
  runTaskSequential();
  
  if (globalInterval) clearInterval(globalInterval);
  globalInterval = setInterval(() => {
    if (globalState.isActive) {
      globalState.connectionStats = {
        packets: globalState.connectionStats.packets + Math.floor(Math.random() * 100),
        bytes: globalState.connectionStats.bytes + Math.floor(Math.random() * 10000),
        connections: globalState.connectionStats.connections + (Math.random() > 0.9 ? 1 : 0),
        latency: Math.floor(Math.random() * 50) + 10
      };
      globalState.internetSpeed = Math.floor(Math.random() * 900) + 50;
      const change = Math.floor(Math.random() * 5) - 2;
      let newValue = globalState.serversConnected + change;
      if (newValue < 8) newValue = 8;
      if (newValue > 28) newValue = 28;
      globalState.serversConnected = newValue;
      forceUpdateCallback?.();
    }
  }, 1000);
  
  if (globalLogInterval) clearInterval(globalLogInterval);
  globalLogInterval = setInterval(() => {
    if (globalState.isActive) {
      const randomMsg = consoleMessages[Math.floor(Math.random() * consoleMessages.length)];
      const timestamp = new Date().toLocaleTimeString();
      globalState.globalLog = [`[${timestamp}] ${randomMsg}`, ...globalState.globalLog].slice(0, 20000);
      forceUpdateCallback?.();
    }
  }, 2500);
}

function stopGlobalSimulation() {
  globalState.isActive = false;
  globalState.currentOperation = 'Idle';
  globalState.internetSpeed = 0;
  globalState.serversConnected = 0;
  
  taskOutputIntervals.forEach(clearInterval);
  taskProgressIntervals.forEach(clearInterval);
  taskOutputIntervals = [];
  taskProgressIntervals = [];
  
  if (globalInterval) clearInterval(globalInterval);
  if (globalLogInterval) clearInterval(globalLogInterval);
  globalInterval = null;
  globalLogInterval = null;
  
  forceUpdateCallback?.();
}

export const ExpertMode: React.FC = () => {
  const [_, setTick] = useState(0);
  
  useEffect(() => {
    forceUpdateCallback = () => setTick(prev => prev + 1);
    return () => { forceUpdateCallback = null; };
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'running': return 'status-running';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return 'status-pending';
    }
  };
  
  const formatSpeed = (speed: number) => `${Math.floor(speed)} Mbps`;
  
  return (
    <div className="expert-mode">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🎯</span> Expert Mode - Operation Control
          </div>
          <div className="panel-subtitle">Advanced penetration testing & exploitation suite</div>
        </div>
        <div className="speed-indicator">
          <div className="speed-label">INTERNET SPEED</div>
          <div className="speed-bar-container">
            <div className="speed-bar" style={{ width: `${(globalState.internetSpeed / 1000) * 100}%` }}></div>
          </div>
          <div className="speed-value">{formatSpeed(globalState.internetSpeed)}</div>
        </div>
      </div>
      
      <div className="expert-layout">
        <div className="expert-left">
          <div className="expert-card">
            <div className="card-header">
              <div className="card-title">🎯 OPERATION TASKS</div>
              {!globalState.isActive ? (
                <button className="btn-start" onClick={startGlobalSimulation}>🚀 START OPERATION</button>
              ) : (
                <button className="btn-stop" onClick={stopGlobalSimulation}>⏹️ STOP OPERATION</button>
              )}
            </div>
            <div className="tasks-list">
              {globalState.tasks.map(task => (
                <div key={task.id} className={`task-item ${getStatusClass(task.status)}`}>
                  <div className="task-header">
                    <div className="task-icon">{getStatusIcon(task.status)}</div>
                    <div className="task-name">{task.name}</div>
                    {task.status === 'running' && <div className="task-progress">{Math.floor(task.progress)}%</div>}
                  </div>
                  {task.status === 'running' && (
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${task.progress}%` }}></div></div>
                  )}
                  {task.output.length > 0 && (
                    <div className="task-output">
                      {task.output.slice(-3).map((line, idx) => <div key={idx} className="output-line">└─ {line}</div>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="expert-right">
          <div className="expert-card stats-card">
            <div className="card-header">
              <div className="card-title">📊 LIVE STATISTICS</div>
              <div className="servers-badge">🖥️ CONNECTED SERVERS: {globalState.serversConnected}</div>
            </div>
            <div className="stats-grid">
              <div className="stat-box"><div className="stat-icon">📦</div><div className="stat-info"><div className="stat-label">Packets</div><div className="stat-number">{globalState.connectionStats.packets.toLocaleString()}</div></div></div>
              <div className="stat-box"><div className="stat-icon">💾</div><div className="stat-info"><div className="stat-label">Data Transferred</div><div className="stat-number">{(globalState.connectionStats.bytes / 1024 / 1024).toFixed(2)} MB</div></div></div>
              <div className="stat-box"><div className="stat-icon">🔗</div><div className="stat-info"><div className="stat-label">Active Connections</div><div className="stat-number">{globalState.connectionStats.connections}</div></div></div>
              <div className="stat-box"><div className="stat-icon">⏱️</div><div className="stat-info"><div className="stat-label">Latency</div><div className="stat-number">{globalState.connectionStats.latency} ms</div></div></div>
            </div>
          </div>
          
          <div className="expert-card console-card">
            <div className="card-header">
              <div className="card-title">📝 LIVE CONSOLE LOG</div>
              <div className="log-count">{globalState.globalLog.length} entries</div>
            </div>
            <div className="console-log expanded">
              {globalState.globalLog.length === 0 ? (
                <div className="log-placeholder">Awaiting operation start...</div>
              ) : (
                globalState.globalLog.map((log, idx) => <div key={idx} className="log-line">{log}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
      
      {globalState.isActive && <div className="matrix-overlay"></div>}
    </div>
  );
};