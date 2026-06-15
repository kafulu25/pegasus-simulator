export interface Target {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: 'active' | 'idle' | 'offline';
  os: 'iOS' | 'Android';
  device: string;
  country: string;
  infectedSince?: string;
  agentVersion?: string;
  lastSeen?: Date;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface FeedEvent {
  id: string;
  targetId: number;
  targetName: string;
  type: 'message' | 'location' | 'call' | 'app' | 'keylog' | 'camera' | 'microphone';
  app: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
}

export interface Conversation {
  id: number;
  targetId: number;
  targetName: string;
  app: 'whatsapp' | 'telegram' | 'signal' | 'imessage' | 'sms';
  contact: string;
  contactAvatar?: string;
  preview: string;
  unread: number;
  lastMessageTime: Date;
  isEncrypted: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
  direction: 'in' | 'out';
  text: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
}

 export interface CallLog {
  id: number;
  targetId: number;
  targetName: string;
  direction: 'incoming' | 'outgoing' | 'missed';
  number: string;
  contactName?: string;
  date: Date;
  duration: number;
  hasRecording: boolean;
  app: string;
  recordingUrl?: string;
}

export interface LocationPoint {
  id: number;
  targetId: number;
  targetName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  timestamp: Date;
  accuracy: number;
  speed?: number;
  heading?: number;
}

export interface MediaItem {
  id: number;
  targetId: number;
  targetName: string;
  type: 'photo' | 'video' | 'document' | 'screenshot';
  filename: string;
  thumbnail?: string;
  size: number;
  timestamp: Date;
  source: 'camera' | 'gallery' | 'downloads' | 'screenshot';
}

export interface KeylogEntry {
  id: number;
  targetId: number;
  targetName: string;
  app: string;
  text: string;
  timestamp: Date;
  containsPassword: boolean;
}

export interface BrowserHistory {
  id: number;
  targetId: number;
  targetName: string;
  browser: 'chrome' | 'safari' | 'firefox' | 'edge';
  url: string;
  title: string;
  timestamp: Date;
  visitCount: number;
}

export interface Contact {
  id: number;
  targetId: number;
  targetName: string;
  name: string;
  phoneNumbers: string[];
  emails: string[];
  interactionCount: number;
  lastInteraction: Date;
  isFrequent: boolean;
}

export interface Email {
  id: number;
  targetId: number;
  targetName: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: Date;
  hasAttachments: boolean;
  isRead: boolean;
  folder: string;
}

export interface Credential {
  id: number;
  targetId: number;
  targetName: string;
  service: string;
  username: string;
  password: string;
  token?: string;
  capturedAt: Date;
  strength: 'weak' | 'medium' | 'strong';
}

export interface Recording {
  id: number;
  targetId: number;
  targetName: string;
  type: 'ambient' | 'call';
  duration: number;
  size: number;
  timestamp: Date;
  url: string;
}

export interface InfectionVector {
  id: string;
  name: string;
  description: string;
  type: 'zero-click' | 'one-click' | 'network';
  platforms: string[];
  riskLevel: 'high' | 'medium' | 'low';
  successRate: number;
}

export interface InfectionDeployment {
  id: number;
  targetId: number;
  targetName: string;
  vector: string;
  date: Date;
  status: 'pending' | 'success' | 'failed';
  osVersion: string;
  agentVersion: string;
}

export interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  icon: string;
  title: string;
  description: string;
  metadata: string;
  timestamp: Date;
  dismissed: boolean;
  acknowledged: boolean;
}

export interface Settings {
  opsec: {
    autoDestruct: boolean;
    trafficObfuscation: boolean;
    stealthMode: boolean;
    encryptedStorage: boolean;
    antiForensics: boolean;
  };
  c2: {
    primary: string;
    backup: string;
    syncInterval: number;
    encryptionKey: string;
  };
  dataCollection: {
    messages: boolean;
    calls: boolean;
    location: boolean;
    photos: boolean;
    keylogger: boolean;
    browserHistory: boolean;
    passwords: boolean;
    contacts: boolean;
    email: boolean;
    microphone: boolean;
    camera: boolean;
    screenCapture: boolean;
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export interface Stats {
  totalTargets: number;
  activeTargets: number;
  totalDataSize: number;
  activeSessions: number;
  criticalAlerts: number;
  messagesIntercepted: number;
  callsRecorded: number;
  locationsTracked: number;
}
export interface Target {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: 'active' | 'idle' | 'offline';
  os: 'iOS' | 'Android';
  device: string;
  country: string;
  phoneNumber?: string;  // Add this line
  infectedSince?: string;
  agentVersion?: string;
  lastSeen?: Date;
  batteryLevel?: number;
  signalStrength?: number;
}
