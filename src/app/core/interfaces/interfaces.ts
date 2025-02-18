export interface State {
  searchTerm: string;
  workshops: Workshop[];
  selectedWorkshop: Workshop | null;
}

export interface Workshop {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image?: string;
  imageUrl?: string;
  date: Date;
  location: string;
  // Optional properties used in other components
  price?: number;
  maxParticipants?: number;
  availableSlots?: number;
  // You can add more optional fields (startTime, endTime) if needed:
  startTime?: string;
  endTime?: string;
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