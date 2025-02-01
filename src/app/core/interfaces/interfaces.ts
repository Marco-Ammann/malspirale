export interface State {
  searchTerm: string;
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
}

export interface Workshop {
  id: string;
  title: string;
  date: string;
  maxParticipants: number;
  availableSlots: number;
  description: string;
  location: string;
  participants?: string[];
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
