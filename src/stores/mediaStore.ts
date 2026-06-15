import { create } from 'zustand';
import { MediaItem } from '@/types';

interface MediaStore {
  photos: MediaItem[];
  documents: MediaItem[];
  screenshots: MediaItem[];
  addPhoto: (photo: MediaItem) => void;
  addDocument: (doc: MediaItem) => void;
  addScreenshot: (screenshot: MediaItem) => void;
}

const mockPhotos: MediaItem[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', type: 'photo', filename: 'IMG_001.jpg', size: 2450000, timestamp: new Date(), source: 'camera' },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', type: 'photo', filename: 'IMG_002.jpg', size: 1890000, timestamp: new Date(Date.now() - 86400000), source: 'gallery' },
  { id: 3, targetId: 2, targetName: 'Leila Nazari', type: 'photo', filename: 'IMG_003.jpg', size: 3200000, timestamp: new Date(Date.now() - 172800000), source: 'camera' },
];

const mockDocuments: MediaItem[] = [
  { id: 4, targetId: 1, targetName: 'Ahmad Karimi', type: 'document', filename: 'classified_report.pdf', size: 4500000, timestamp: new Date(), source: 'downloads' },
  { id: 5, targetId: 2, targetName: 'Leila Nazari', type: 'document', filename: 'contacts.vcf', size: 125000, timestamp: new Date(Date.now() - 86400000), source: 'downloads' },
];

const mockScreenshots: MediaItem[] = [
  { id: 6, targetId: 3, targetName: 'Marcus Webb', type: 'screenshot', filename: 'screenshot_001.png', size: 890000, timestamp: new Date(), source: 'screenshot' },
  { id: 7, targetId: 3, targetName: 'Marcus Webb', type: 'screenshot', filename: 'screenshot_002.png', size: 1230000, timestamp: new Date(Date.now() - 3600000), source: 'screenshot' },
];

export const useMediaStore = create<MediaStore>((set) => ({
  photos: mockPhotos,
  documents: mockDocuments,
  screenshots: mockScreenshots,
  
  addPhoto: (photo) => set((state) => ({ photos: [photo, ...state.photos] })),
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  addScreenshot: (screenshot) => set((state) => ({ screenshots: [screenshot, ...state.screenshots] })),
}));