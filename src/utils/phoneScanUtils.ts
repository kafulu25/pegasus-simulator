// src/utils/phoneScanUtils.ts
import { Packet, CallLog, MessageLog, ScanResult } from '@/stores/phoneScanStore';

// Ugandan number pool
const UG_NUMBERS = ['0755123456', '0776123456', '0788123456', '0701123456', '0759988776', '0788112233'];
const APPS = ['WhatsApp', 'Telegram', 'Signal', 'Facebook', 'Instagram', 'Snapchat', 'TikTok'];
const PACKET_TYPES = ['sms', 'call', 'gps', 'app', 'contact', 'keystroke'] as const;

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a Base64 string from random data
const randomBase64 = (len: number = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a packet with an advancing timestamp
let currentPacketTime = new Date(); // will be advanced per packet

const generatePacket = (phone: string): Packet => {
  // Advance time by 1-5 minutes per packet
  const minutesToAdd = randomInt(1, 5);
  currentPacketTime.setMinutes(currentPacketTime.getMinutes() + minutesToAdd);

  const type = randomItem(PACKET_TYPES);
  const otherNumber = randomItem(UG_NUMBERS);
  let data = '';

  switch (type) {
    case 'sms':
      data = `SMS ${randomItem(['incoming', 'outgoing'])} from/to ${otherNumber}: "${randomItem(['Hello', 'Meeting at 5', 'On my way', 'Call me later', 'I\'m here'])}"`;
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

// Process a packet: if it contains a call or message, we store it permanently
export const processPacketForData = (
  packet: Packet,
  phone: string,
): { call?: CallLog; message?: MessageLog; contact?: string } => {
  const result: { call?: CallLog; message?: MessageLog; contact?: string } = {};

  // Extract phone number from packet data (simple regex)
  const numberMatch = packet.data.match(/(07\d{8})/);
  const extractedNumber = numberMatch ? numberMatch[1] : randomItem(UG_NUMBERS);

  if (packet.type === 'call') {
    const directionMatch = packet.data.match(/(incoming|outgoing|missed)/);
    const durationMatch = packet.data.match(/\((\d+)s\)/);
    const direction = (directionMatch ? directionMatch[1] : 'incoming') as 'incoming' | 'outgoing' | 'missed';
    const duration = durationMatch ? `${Math.floor(parseInt(durationMatch[1]) / 60)}:${String(parseInt(durationMatch[1]) % 60).padStart(2, '0')}` : '0:00';
    result.call = {
      direction,
      number: extractedNumber,
      duration,
      time: packet.timestamp,
    };
  }

  if (packet.type === 'sms') {
    const directionMatch = packet.data.match(/(incoming|outgoing)/);
    const contentMatch = packet.data.match(/"([^"]+)"/);
    const direction = (directionMatch ? directionMatch[1] : 'incoming') as 'incoming' | 'outgoing';
    const content = contentMatch ? contentMatch[1] : 'Hello';
    // Assign random platform based on packet data
    const platform = randomItem(['sms', 'whatsapp', 'telegram']) as 'sms' | 'whatsapp' | 'telegram';
    result.message = {
      platform,
      direction,
      number: extractedNumber,
      content,
      time: packet.timestamp,
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

// Generate final scan result from accumulated data
export const buildFinalReport = (
  phone: string,
  calls: CallLog[],
  messages: MessageLog[],
  contacts: Set<string>,
): ScanResult => {
  // Calculate frequencies
  const numberCounts: Record<string, number> = {};
  [...calls, ...messages].forEach(item => {
    const num = item.number;
    numberCounts[num] = (numberCounts[num] || 0) + 1;
  });

  const associatedNumbers = Object.entries(numberCounts)
    .map(([number, frequency]) => ({ number, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  // Top callers (only call logs)
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

  // Top callees (same, just for symmetry)
  const topCallees = topCallers.slice(0, 5);

  // Coordinates – pick one from the last GPS packet (or random)
  const coord = { lat: 0.3136 + (Math.random() - 0.5) * 0.05, lng: 32.5811 + (Math.random() - 0.5) * 0.05 };
  const coordTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Installed apps – based on app packets discovered
  const appSet = new Set<string>();
  // In a real scenario, we'd scan packets for "App usage detected: XXX"
  // For simulation, we'll pick 3-5 random apps
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
