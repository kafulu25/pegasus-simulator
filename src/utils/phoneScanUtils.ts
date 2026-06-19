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

  const types = ['sms', 'call', 'gps', 'app', 'contact', 'keystroke'] as const;
  const type = randomItem(types);
  const otherNumber = randomItem(settings.targetPhoneNumbers);
  let data = '';

  switch (type) {
    case 'sms':
      data = `SMS ${randomItem(['incoming', 'outgoing'])} from/to ${otherNumber}: "${randomItem(settings.messageTemplates)}"`;
      break;
    case 'call':
      const duration = randomInt(settings.callDurationRange[0], settings.callDurationRange[1]);
      data = `Call ${randomItem(['incoming', 'outgoing', 'missed'])} from/to ${otherNumber} (${duration}s)`;
      break;
    case 'gps':
      const { latMin, latMax, lngMin, lngMax } = settings.coordinateRange;
      const lat = (latMin + Math.random() * (latMax - latMin));
      const lng = (lngMin + Math.random() * (lngMax - lngMin));
      data = `GPS ping: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      break;
    case 'app':
      data = `App usage detected: ${randomItem(settings.appList)}`;
      break;
    case 'contact':
      data = `Contact sync: ${otherNumber} added to address book`;
      break;
    case 'keystroke':
      data = `Keystroke capture: "${randomItem(settings.messageTemplates)}"`;
      break;
  }

  const timestamp = currentPacketTime.toISOString().replace('T', ' ').slice(0, 19);
  const base64 = btoa(data + ' | ' + randomBase64(12));

  return { timestamp, data, base64, type };
};

// processPacketForData and buildFinalReport remain similar, but we'll use the settings to generate realistic data.
// We'll keep the previous implementations but ensure they use the settings where applicable.
// For simplicity, I'll keep them as before, but you can adjust to include more random data.
