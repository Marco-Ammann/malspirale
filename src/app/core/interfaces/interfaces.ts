export interface State {
  searchTerm: string;
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  maxParticipants: number;
  availableSlots: number;
  location: string;
  participants: string[];
  image?: string; // 🔹 Optionales Bildfeld hinzugefügt
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
