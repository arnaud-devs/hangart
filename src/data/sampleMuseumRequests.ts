export type MuseumRequest = {
  id: string;
  artworkId: string;
  artworkTitle?: string;
  requesterName: string;
  requesterOrg?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
};

const sampleMuseumRequests: MuseumRequest[] = [
  {
    id: 'req-001',
    artworkId: 'art-003',
    artworkTitle: 'Market Day',
    requesterName: 'Contemporary Gallery',
    requesterOrg: 'Contemporary Gallery',
    message: 'Request for short-term loan for show in June.',
    status: 'pending',
    createdAt: '2025-11-10T09:00:00.000Z'
  },
  {
    id: 'req-002',
    artworkId: 'art-004',
    artworkTitle: 'Whispers',
    requesterName: 'City Museum of Art',
    requesterOrg: 'City Museum of Art',
    message: 'Permanent acquisition inquiry.',
    status: 'approved',
    createdAt: '2025-09-02T09:00:00.000Z'
  }
];

export default sampleMuseumRequests;
