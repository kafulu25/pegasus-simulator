let globalInterval: NodeJS.Timeout | null = null;
let globalLogInterval: NodeJS.Timeout | null = null;
let isSimulationRunning = false;
let subscribers: Array<() => void> = [];

// Store that persists across tab switches
let simulationState = {
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
  taskOutputs: {
    1: ['Handshake established', 'TLS 1.3 negotiation complete', 'Session key exchanged', 'Connection secured'],
    2: ['Firewall rule bypassed', 'WAF evasion detected', 'Port knocking successful', 'IDS/IPS bypassed'],
    3: ['Traffic encrypted with AES-256', 'Perfect forward secrecy enabled', 'OpenVPN tunnel established', 'SSH tunnel created'],
    4: ['Scanning subnet /24...', 'Service enumeration complete', '6 hosts discovered', 'Open ports: 22, 80, 443, 3306'],
    5: ['Hash extraction in progress', 'Brute forcing NTLM hashes', 'Password found: admin123', 'Token captured'],
    6: ['Dumping MySQL database...', 'Table: users (247 rows)', 'Table: messages (1,892 rows)', 'Archive created: dump.sql'],
    7: ['Promiscuous mode enabled', 'Capturing network traffic', 'SSL stripping active', 'Session cookie intercepted'],
    8: ['Persistence established', 'Backdoor deployed', 'Cleaning logs...', 'Operation complete']
  }
};

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
];

export function subscribeToSimulation(callback: () => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

function notifySubscribers() {
  subscribers.forEach(cb => cb());
}

export function getSimulationState() {
  return simulationState;
}

export function startSimulation() {
  if (isSimulationRunning) return;
  isSimulationRunning = true;
  simulationState.isActive = true;
  simulationState.globalLog = [];
  notifySubscribers();

  // Run tasks sequentially
  let taskIndex = 0;
  
  function runNextTask() {
    if (taskIndex >= simulationState.tasks.length) {
      simulationState.currentOperation = 'Access Granted';
      notifySubscribers();
      return;
    }
    
    const task = simulationState.tasks[taskIndex];
    let outputIndex = 0;
    let progress = 0;
    
    simulationState.tasks[taskIndex] = { ...task, status: 'running', progress: 0, output: [] };
    notifySubscribers();
    
    const outputTimer = setInterval(() => {
      if (outputIndex < simulationState.taskOutputs[task.id].length) {
        simulationState.tasks[taskIndex] = {
          ...simulationState.tasks[taskIndex],
          output: [...simulationState.tasks[taskIndex].output, simulationState.taskOutputs[task.id][outputIndex]]
        };
        outputIndex++;
        notifySubscribers();
      } else {
        clearInterval(outputTimer);
      }
    }, 600);
    
    const progressTimer = setInterval(() => {
      if (progress < 100) {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        simulationState.tasks[taskIndex] = {
          ...simulationState.tasks[taskIndex],
          progress: Math.min(progress, 100)
        };
        notifySubscribers();
      } else {
        clearInterval(progressTimer);
        simulationState.tasks[taskIndex] = {
          ...simulationState.tasks[taskIndex],
          status: 'completed'
        };
        notifySubscribers();
        taskIndex++;
        runNextTask();
      }
    }, 200);
  }
  
  runNextTask();
  
  // Update stats every second
  if (globalInterval) clearInterval(globalInterval);
  globalInterval = setInterval(() => {
    if (simulationState.isActive) {
      simulationState.connectionStats = {
        packets: simulationState.connectionStats.packets + Math.floor(Math.random() * 100),
        bytes: simulationState.connectionStats.bytes + Math.floor(Math.random() * 10000),
        connections: simulationState.connectionStats.connections + (Math.random() > 0.9 ? 1 : 0),
        latency: Math.floor(Math.random() * 50) + 10
      };
      simulationState.internetSpeed = Math.floor(Math.random() * 900) + 50;
      simulationState.serversConnected = Math.min(simulationState.serversConnected + Math.floor(Math.random() * 2), 24);
      notifySubscribers();
    }
  }, 1000);
  
  // Generate console logs every 3 seconds
  if (globalLogInterval) clearInterval(globalLogInterval);
  globalLogInterval = setInterval(() => {
    if (simulationState.isActive) {
      const randomMsg = consoleMessages[Math.floor(Math.random() * consoleMessages.length)];
      simulationState.globalLog = [`[${new Date().toLocaleTimeString()}] ${randomMsg}`, ...simulationState.globalLog].slice(0, 500);
      notifySubscribers();
    }
  }, 3000);
}

export function stopSimulation() {
  simulationState.isActive = false;
  isSimulationRunning = false;
  if (globalInterval) clearInterval(globalInterval);
  if (globalLogInterval) clearInterval(globalLogInterval);
  globalInterval = null;
  globalLogInterval = null;
  notifySubscribers();
}