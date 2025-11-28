export type Order = {
  id: string;
  artworkId: string;
  artworkTitle: string;
  buyerId: string;
  amount: number;
  currency: string;
  date: string;
  status?: 'completed' | 'pending' | 'cancelled' | 'refunded';
  paymentMethod?: string;
};

export const sampleOrders: Order[] = [
  { id: 'ord-001', artworkId: 'art-001', artworkTitle: 'Sunset Over Kigali', buyerId: 'buyer-01', amount: 450, currency: 'USD', date: '2025-10-12T12:00:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'ord-002', artworkId: 'art-007', artworkTitle: 'Silent River', buyerId: 'buyer-01', amount: 420, currency: 'USD', date: '2025-08-20T14:30:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'ord-003', artworkId: 'art-010', artworkTitle: 'Metropolitan', buyerId: 'buyer-02', amount: 980, currency: 'USD', date: '2025-07-05T16:00:00.000Z', status: 'refunded', paymentMethod: 'card' },
  { id: 'ord-004', artworkId: 'art-005', artworkTitle: 'Glass and Light', buyerId: 'buyer-01', amount: 600, currency: 'USD', date: '2025-10-25T13:40:00.000Z', status: 'completed', paymentMethod: 'card' },
  { id: 'ord-005', artworkId: 'art-012', artworkTitle: 'River Merchants', buyerId: 'buyer-03', amount: 510, currency: 'USD', date: '2025-08-10T15:30:00.000Z', status: 'completed', paymentMethod: 'bank' },
  { id: 'ord-006', artworkId: 'art-002', artworkTitle: 'Blue Silence', buyerId: 'buyer-01', amount: 780, currency: 'USD', date: '2025-11-01T10:15:00.000Z', status: 'pending', paymentMethod: 'card' }
];

export default sampleOrders;
