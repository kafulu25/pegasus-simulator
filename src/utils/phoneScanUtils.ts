import { Packet, CallLog, Message, ScanResult } from '@/stores/phoneScanStore';
import type { CallLog as ExistingCallLog, Message as ExistingMessage } from '@/types';

// Ugandan number pool
const UG_NUMBERS = ['0755123456', '0776123456', '0788123456', '0701123456', '0759988776', '0788112233'];
const APPS = ['WhatsApp', 'Telegram', 'Signal', 'Facebook', 'Instagram', 'Snapchat', 'TikTok'];
const PACKET_TYPES = ['sms', 'call', 'gps', 'app', 'contact', 'keystroke'] as const;

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
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
  const minutesToAdd = randomInt(1, 5);
  currentPacketTime.setMinutes(currentPacketTime.getMinutes() + minutesToAdd);

  const type = randomItem(PACKET_TYPES);
  const otherNumber = randomItem(UG_NUMBERS);
  let data = '';

  switch (type) {
    case 'sms':
      data = `SMS ${randomItem(['incoming', 'outgoing'])} from/to ${otherNumber}: "${randomItem(['Hello', 'Meeting at 5', 'On my way', 'Call me later', "I'm here"])}"`;
      break;
    case 'call':
      data = `Call ${randomItem(['incoming', 'outgoing', 'missed'])} from/to ${otherNumber} (${randomInt(0, 300)}s)`;
      break;
    case 'gps':
      data = `GPS ping: ${(0.3 + Math.random() * 0.1).toFixed(4)}, ${(32.5 + Math.random() * 0.2).toFixed(4)}`;
      break;
    case 'app':
      data = `App usage detected: ${randomItem(APPS)}`;
      break;
    case 'contact':
      data = `Contact sync: ${otherNumber} added to address book`;
      break;
    case 'keystroke':
      data = `Keystroke capture: "${randomItem(['password', 'hello', '123456', 'secret', 'meeting'])}"`;
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
  const extractedNumber = numberMatch ? numberMatch[1] : randomItem(UG_NUMBERS);

  if (packet.type === 'call') {
    const directionMatch = packet.data.match(/(incoming|outgoing|missed)/);
    const durationMatch = packet.data.match(/\((\d+)s\)/);
    const direction = (directionMatch ? directionMatch[1] : 'incoming') as 'incoming' | 'outgoing' | 'missed';
    const duration = durationMatch ? `${Math.floor(parseInt(durationMatch[1]) / 60)}:${String(parseInt(durationMatch[1]) % 60).padStart(2, '0')}` : '0:00';
    result.call = {
      id: Date.now() + Math.random(),
      targetId: 0,
      targetName: phone,
      direction,
      number: extractedNumber,
      date: new Date(packet.timestamp),
      duration: parseInt(durationMatch?.[1] || '0'),
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

  const coord = { lat: 0.3136 + (Math.random() - 0.5) * 0.05, lng: 32.5811 + (Math.random() - 0.5) * 0.05 };
  const coordTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const appSet = new Set<string>();
  const numApps = randomInt(3, 5);
  for (let i = 0; i < numApps; i++) {
    appSet.add(randomItem(APPS));
  }

  return {
    phoneNumber: phone,
    calls,
    messages,
    associatedNumbers,
    topCallers,
    topCallees,
    coordinates: { lat: coord.lat, lng: coord.lng, timestamp: coordTimestamp },
    installedApps: Array.from(appSet),
  };
};
