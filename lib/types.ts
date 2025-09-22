export interface Work {
  id: string;
  title: string;
  artist?: string;
  date?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
  narrative?: string;
  provenance?: string;
  exhibition?: string;
  relatedObjects?: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  collectionId: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  curatorNote?: string;
  works: Work[];
}

export interface CollectionData {
  collections: Collection[];
  totalWorks: number;
}
