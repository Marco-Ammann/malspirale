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
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}
