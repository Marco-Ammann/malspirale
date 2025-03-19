export interface Artwork {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  displayOrder?: number;
  timestamp?: number;
  isPublic?: boolean;
  isFeatured?: boolean;
  [key: string]: any; // Allow for other properties
}
