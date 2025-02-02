export interface State {
  searchTerm: string;
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
}

export interface Workshop {
  id?: string;
  title: string;
  location?: string;
  shortDescription: string;
  longDescription?: string;
  date: string; // Startdatum
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  price?: number;
  maxParticipants?: number;
  availableSlots: number;
  image?: string;
  recurring?: boolean; // Ist der Workshop wiederkehrend?
  recurringWeek?: number; // In welcher Woche des Monats wiederkehrend?
  recurringDay?: number; // An welchem Wochentag wiederkehrend?
  createdAt?: string;
  participants?: string[]; // 💡 NEU: Teilnehmer-Liste mit User-IDs
  imagePosition?: 'zentriert' | 'links' | 'rechts' | 'oben' | 'unten' | 'links-oben' | 'rechts-oben' |'rechts-unten' | 'links-unten'; // Bildposition im Detail
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface ContentData {
  text: string;
  images: { url: string; description: string }[];
}