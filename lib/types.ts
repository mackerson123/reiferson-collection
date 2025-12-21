export interface Work {
  id: string;
  title: string;
  artist?: string | null;
  date?: string | null;
  medium?: string | null;
  dimensions?: string | null;
  description?: string | null;
  narrative?: string | null;
  provenance?: string | null;
  exhibition?: string | null;
  relatedObjects?: string[] | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  collectionId: string | null;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string | null;
  curatorNote?: string | null;
  works: Work[];
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CollectionData {
  collections: Collection[];
  totalWorks: number;
}
