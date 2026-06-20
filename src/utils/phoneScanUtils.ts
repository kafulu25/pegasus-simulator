import { Packet, CallLog, Message, ScanResult } from '../stores/phoneScanStore';
import type { CallLog as ExistingCallLog, Message as ExistingMessage } from '../types';
import { usePhoneScanSettingsStore } from '../stores/phoneScanSettingsStore';
  
// Helper to get settings dynamically
const getSettings = () => usePhoneScanSettingsStore.getState().settings;

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomBase64 = (len: number = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

let currentPacketTime = new Date();

export const generatePacket = (phone: string): Packet => {
  const settings = getSettings();
  const minsToAdd = randomInt(1, 5);
  currentPacketTime.setMinutes(currentPacketTime.getMinutes() + minsToAdd);

  const types = ['sms', 'call', 'gps', 'app', 'contact', 'keystroke', 'encrypted_voice', 'encrypted_whatsapp', 'fetching_gallery'] as const;
  const type = randomItem(types);
  const otherNumber = randomItem(settings.targetPhoneNumbers || ['0755123456']);
  let data = '';

  switch (type) {
    case 'sms':
      data = `SMS ${randomItem(['incoming', 'outgoing'])} from/to ${otherNumber}: "${randomItem(settings.messageTemplates || ['Hello'])}"`;
      break;
    case 'call':
      const duration = randomInt(settings.callDurationRange?.[0] || 10, settings.callDurationRange?.[1] || 300);
      data = `Call ${randomItem(['incoming', 'outgoing', 'missed'])} from/to ${otherNumber} (${duration}s)`;
      break;
    case 'gps':
      const { latMin = 0.3, latMax = 0.35, lngMin = 32.5, lngMax = 32.65 } = settings.coordinateRange || {};
      const lat = (latMin + Math.random() * (latMax - latMin));
      const lng = (lngMin + Math.random() * (lngMax - lngMin));
      data = `GPS ping: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      break;
    case 'app':
      data = `App usage detected: ${randomItem(settings.appList || ['WhatsApp'])}`;
      break;
    case 'contact':
      data = `Contact sync: ${otherNumber} added to address book`;
      break;
    case 'keystroke':
      data = `Keystroke capture: "${randomItem(settings.messageTemplates || ['hello'])}"`;
      break;
      case 'encrypted_voice':
  data = `Encrypted voice packet intercepted (SRTP) – duration ${randomInt(10, 300)}s`;
  break;
case 'encrypted_whatsapp':
  data = `WhatsApp E2E encrypted message: "${randomItem(settings.messageTemplates)}" (AES-256-GCM)`;
  break;
case 'fetching_gallery':
  data = `Fetching gallery thumbnails – ${randomInt(50, 500)} images found`;
  break;
  }

  const timestamp = currentPacketTime.toISOString().replace('T', ' ').slice(0, 19);
  const base64 = btoa(data + ' | ' + randomBase64(12));

  return { timestamp, data, base64, type };
};

export const processPacketForData = (
  packet: Packet,
  phone: string,
): { call?: ExistingCallLog; message?: ExistingMessage; contact?: string } => {
  const result: { call?: ExistingCallLog; message?: ExistingMessage; contact?: string } = {};
  const numberMatch = packet.data.match(/(07\d{8})/);
  const settings = getSettings();
  const defaultNumbers = settings.targetPhoneNumbers || ['0755123456'];
  const extractedNumber = numberMatch ? numberMatch[1] : randomItem(defaultNumbers);

  if (packet.type === 'call') {
    const directionMatch = packet.data.match(/(incoming|outgoing|missed)/);
    const durationMatch = packet.data.match(/\((\d+)s\)/);
    const direction = (directionMatch ? directionMatch[1] : 'incoming') as 'incoming' | 'outgoing' | 'missed';
    const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
    result.call = {
      id: Date.now() + Math.random(),
      targetId: 0,
      targetName: phone,
      direction,
      number: extractedNumber,
      date: new Date(packet.timestamp),
      duration,
      hasRecording: false,
      app: 'Unknown',
    };
  }

  if (packet.type === 'sms') {
    const directionMatch = packet.data.match(/(incoming|outgoing)/);
    const contentMatch = packet.data.match(/"([^"]+)"/);
    const direction = (directionMatch ? directionMatch[1] : 'incoming') as 'incoming' | 'outgoing';
    const content = contentMatch ? contentMatch[1] : 'Hello';
    const platform = randomItem(['whatsapp', 'telegram', 'signal', 'sms']) as 'whatsapp' | 'telegram' | 'signal' | 'sms';
    result.message = {
      id: Date.now() + Math.random(),
      conversationId: 0,
      direction: direction === 'incoming' ? 'in' : 'out',
      text: content,
      timestamp: new Date(packet.timestamp),
      isRead: false,
    };
  }

  if (packet.type === 'contact') {
    const contactMatch = packet.data.match(/(07\d{8})/);
    if (contactMatch) {
      result.contact = contactMatch[1];
    }
  }

  return result;
};

export const buildFinalReport = (
  phone: string,
  calls: ExistingCallLog[],
  messages: ExistingMessage[],
  contacts: Set<string>,
): ScanResult => {
  const numberCounts: Record<string, number> = {};
  [...calls, ...messages].forEach(item => {
    const num = 'number' in item ? (item as ExistingCallLog).number : 'Unknown';
    numberCounts[num] = (numberCounts[num] || 0) + 1;
  });

  const associatedNumbers = Object.entries(numberCounts)
    .map(([number, frequency]) => ({ number, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const callerCounts: Record<string, number> = {};
  calls.forEach(c => {
    if (c.direction === 'incoming' || c.direction === 'outgoing') {
      callerCounts[c.number] = (callerCounts[c.number] || 0) + 1;
    }
  });
  const topCallers = Object.entries(callerCounts)
    .map(([number, count]) => ({ number, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCallees = topCallers.slice(0, 5);

  // Generate random coordinates based on settings
  const settings = getSettings();
  const { latMin = 0.3, latMax = 0.35, lngMin = 32.5, lngMax = 32.65 } = settings.coordinateRange || {};
  const lat = latMin + Math.random() * (latMax - latMin);
  const lng = lngMin + Math.random() * (lngMax - lngMin);
  const coordTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const appSet = new Set<string>();
  const apps = settings.appList || ['WhatsApp', 'Telegram', 'Signal'];
  const numApps = Math.min(apps.length, 3 + Math.floor(Math.random() * 3));
  for (let i = 0; i < numApps; i++) {
    appSet.add(apps[i % apps.length]);
  }

  return {
    phoneNumber: phone,
    calls,
    messages,
    associatedNumbers,
    topCallers,
    topCallees,
    coordinates: { lat, lng, timestamp: coordTimestamp },
    installedApps: Array.from(appSet),
  };
};
