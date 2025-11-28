export type Transaction = {
  id: string;
  artworkId: string;
  artworkTitle: string;
  buyerName: string;
  amount: number;
  currency: string;
  date: string;
  status?: 'completed' | 'pending' | 'refunded';
  paymentMethod?: string;
};

export const sampleTransactions: Transaction[] = [
  { id: 'tx-001', artworkId: 'art-001', artworkTitle: 'Sunset Over Kigali', buyerName: 'John Doe', amount: 450, currency: 'USD', date: '2025-10-12T12:00:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'tx-002', artworkId: 'art-004', artworkTitle: 'Whispers', buyerName: 'Museum of Art', amount: 1500, currency: 'USD', date: '2025-09-02T09:00:00.000Z', status: 'completed', paymentMethod: 'bank' },
  { id: 'tx-003', artworkId: 'art-007', artworkTitle: 'Silent River', buyerName: 'Alice Smith', amount: 420, currency: 'USD', date: '2025-08-20T14:30:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'tx-004', artworkId: 'art-010', artworkTitle: 'Metropolitan', buyerName: 'City Collector', amount: 980, currency: 'USD', date: '2025-07-05T16:00:00.000Z', status: 'refunded', paymentMethod: 'card' },
  { id: 'tx-005', artworkId: 'art-008', artworkTitle: 'Portrait of a Collector', buyerName: 'Private Buyer', amount: 2200, currency: 'USD', date: '2025-05-21T11:20:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'tx-006', artworkId: 'art-002', artworkTitle: 'Blue Silence', buyerName: 'Gallery One', amount: 780, currency: 'USD', date: '2025-11-01T10:15:00.000Z', status: 'pending', paymentMethod: 'card' },
  { id: 'tx-007', artworkId: 'art-005', artworkTitle: 'Glass and Light', buyerName: 'L. Patterson', amount: 600, currency: 'USD', date: '2025-10-25T13:40:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'tx-008', artworkId: 'art-011', artworkTitle: 'Night Bloom', buyerName: 'Collector B', amount: 270, currency: 'USD', date: '2025-09-18T09:05:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'tx-009', artworkId: 'art-012', artworkTitle: 'River Merchants', buyerName: 'Market Fund', amount: 510, currency: 'USD', date: '2025-08-10T15:30:00.000Z', status: 'completed', paymentMethod: 'bank' },
  { id: 'tx-010', artworkId: 'art-013', artworkTitle: 'Starlit Balcony', buyerName: 'C. Williams', amount: 350, currency: 'USD', date: '2025-11-18T20:00:00.000Z', status: 'pending', paymentMethod: 'card' },
  { id: 'tx-011', artworkId: 'art-014', artworkTitle: 'Concrete Jungle', buyerName: 'Urban Gallery', amount: 640, currency: 'USD', date: '2025-11-20T11:00:00.000Z', status: 'pending', paymentMethod: 'card' },
  { id: 'tx-012', artworkId: 'art-003', artworkTitle: 'Market Day', buyerName: 'Art Consumer', amount: 320, currency: 'USD', date: '2025-10-02T08:30:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'tx-013', artworkId: 'art-009', artworkTitle: 'Geometry of Memory', buyerName: 'Modern Arts', amount: 380, currency: 'USD', date: '2025-11-05T14:10:00.000Z', status: 'completed', paymentMethod: 'bank' },
  { id: 'tx-014', artworkId: 'art-015', artworkTitle: 'Cerulean Daydream', buyerName: 'Blue Collective', amount: 275, currency: 'USD', date: '2025-11-22T09:45:00.000Z', status: 'pending', paymentMethod: 'card' },
  { id: 'tx-015', artworkId: 'art-006', artworkTitle: 'Echoes', buyerName: 'Digital Patron', amount: 200, currency: 'USD', date: '2025-07-30T18:00:00.000Z', status: 'completed', paymentMethod: 'card' },
];

export default sampleTransactions;
