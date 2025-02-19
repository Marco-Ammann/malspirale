export interface State {
  searchTerm: string;
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
}

export interface Workshop {
  id?: string;
  title: string;
  shortDescription: string;
  description: string;
  date?: string;           // z.B. "2025-06-15" – nur für reguläre Workshops
  location?: string;
  price?: number;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  availableSlots?: number;
  frequency?: string;      // Für Malatelier, z.B. "Jeden 1. Mittwoch im Monat"
  contactEmail?: string;   // Für individuelle Anfragen
  imageLoaded?: boolean;
  type: 'workshop' | 'malatelier' | 'individuelleAnfrage';
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