export interface State {
  searchTerm: string;
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
}

export interface Workshop {
  id?: string;
  type: 'workshop' | 'malatelier' | 'individuelleAnfrage';
  title: string;
  shortDescription: string;
  description: string;
  
  // Gemeinsame Felder
  location?: string;
  price?: number;
  imageUrl?: string;
  maxParticipants?: number;
  availableSlots?: number;
  
  // Nur für Einzeltermine
  date?: string;
  startTime?: string;
  endTime?: string;
  
  // Nur für Malateliers
  frequency?: string;
  
  // Nur für individuelle Anfragen
  contactEmail?: string;
  
  // Status und Metadaten
  status?: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
  
  // UI-Flags (nicht persistiert)
  imageLoaded?: boolean;
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