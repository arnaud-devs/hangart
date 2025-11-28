export type CollectionItem = {
  id: string;
  title: string;
  description?: string;
  artworks: string[]; // artwork ids
  totalValue?: number;
  views?: number;
  createdAt?: string;
};

const sampleMuseumCollections: CollectionItem[] = [
  {
    id: 'col-001',
    title: 'Impressionist Highlights',
    description: 'Key impressionist works from our permanent collection.',
    artworks: ['art-004','art-010','art-008'],
    totalValue: 5700,
    views: 12400,
    createdAt: '2025-09-01T08:00:00.000Z'
  },
  {
    id: 'col-002',
    title: 'Contemporary Photography',
    description: 'Modern photography for the contemporary wing.',
    artworks: ['art-001','art-002','art-007'],
    totalValue: 2150,
    views: 6400,
    createdAt: '2025-10-15T08:00:00.000Z'
  }
];

export default sampleMuseumCollections;
