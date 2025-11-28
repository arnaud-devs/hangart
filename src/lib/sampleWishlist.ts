export type WishlistItem = {
  id: string;
  artworkId: string;
  buyerId: string;
  addedAt: string;
};

export const sampleWishlist: WishlistItem[] = [
  { id: 'w-001', artworkId: 'art-004', buyerId: 'buyer-01', addedAt: '2025-11-01T10:00:00.000Z' },
  { id: 'w-002', artworkId: 'art-008', buyerId: 'buyer-01', addedAt: '2025-11-05T09:30:00.000Z' },
  { id: 'w-003', artworkId: 'art-014', buyerId: 'buyer-02', addedAt: '2025-10-20T12:15:00.000Z' },
  { id: 'w-004', artworkId: 'art-001', buyerId: 'buyer-01', addedAt: '2025-09-12T08:24:00.000Z' },
];

export default sampleWishlist;
