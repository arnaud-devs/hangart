export type Artwork = {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  price: number;
  currency: string;
  approved: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  image: string;
  views: number;
  likes: number;
  income: number; // total income generated for the artist
  description?: string;
  // museum-related metadata (optional)
  forMuseum?: boolean;
  museumId?: string;
};

export const sampleArtworks: Artwork[] = [
  {
    id: 'art-001',
    title: 'Sunset Over Kigali',
    artistId: 'artist-01',
    artistName: 'Amina Uwimana',
    price: 450.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-09-02T10:12:00.000Z',
    image: '/arts/art1.jpg',
    views: 1243,
    likes: 312,
    income: 1200.0,
    description: 'A luminous oil painting capturing Kigali skyline at dusk.'
  },
  {
    id: 'art-002',
    title: 'Blue Silence',
    artistId: 'artist-02',
    artistName: 'Jean Mukasa',
    price: 780.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-08-14T09:30:00.000Z',
    image: '/arts/art2.jpg',
    views: 980,
    likes: 210,
    income: 2300.0,
    description: 'A contemplative mixed-media piece exploring form and texture.'
  },
  {
    id: 'art-003',
    title: 'Market Day',
    artistId: 'artist-01',
    artistName: 'Amina Uwimana',
    price: 320.0,
    currency: 'USD',
    approved: false,
    status: 'pending',
    createdAt: '2025-10-01T14:00:00.000Z',
    image: '/arts/art3.jpg',
    views: 412,
    likes: 56,
    income: 0.0,
    description: 'Vivid street scene in expressive brushstrokes.'
  },
  {
    id: 'art-004',
    title: 'Whispers',
    artistId: 'artist-03',
    artistName: 'Luis Ortega',
    price: 1500.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-06-21T11:45:00.000Z',
    image: '/arts/art4.jpg',
    views: 2100,
    likes: 789,
    income: 5400.0,
    description: 'Large scale abstract with layered glazes.'
    ,
    forMuseum: true,
    museumId: 'museum-01'
  },
  {
    id: 'art-005',
    title: 'Glass and Light',
    artistId: 'artist-04',
    artistName: 'Mia Chen',
    price: 600.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-05-10T08:22:00.000Z',
    image: '/arts/art5.jpg',
    views: 840,
    likes: 120,
    income: 900.0,
    description: 'Photographic study of reflective surfaces.'
  },
  {
    id: 'art-006',
    title: 'Echoes',
    artistId: 'artist-05',
    artistName: 'Samuel Nkusi',
    price: 200.0,
    currency: 'USD',
    approved: false,
    status: 'rejected',
    createdAt: '2025-07-16T12:05:00.000Z',
    image: '/arts/art6.jpg',
    views: 124,
    likes: 10,
    income: 0.0,
    description: 'Experimental digital collage.'
  },
  {
    id: 'art-007',
    title: 'Silent River',
    artistId: 'artist-02',
    artistName: 'Jean Mukasa',
    price: 420.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-04-03T16:18:00.000Z',
    image: '/arts/art7.jpg',
    views: 640,
    likes: 98,
    income: 600.0,
    description: 'Serene landscape in soft palettes.'
  },
  {
    id: 'art-008',
    title: 'Portrait of a Collector',
    artistId: 'artist-06',
    artistName: 'Elena Rossi',
    price: 2200.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-03-30T10:00:00.000Z',
    image: '/arts/art8.jpg',
    views: 1500,
    likes: 430,
    income: 4200.0,
    description: 'Intimate oil portrait with classical techniques.'
    ,
    forMuseum: true,
    museumId: 'museum-02'
  },
  {
    id: 'art-009',
    title: 'Geometry of Memory',
    artistId: 'artist-03',
    artistName: 'Luis Ortega',
    price: 380.0,
    currency: 'USD',
    approved: false,
    status: 'pending',
    createdAt: '2025-11-01T09:15:00.000Z',
    image: '/arts/art9.jpg',
    views: 75,
    likes: 6,
    income: 0.0,
    description: 'Minimalist composition exploring space.'
  },
  {
    id: 'art-010',
    title: 'Metropolitan',
    artistId: 'artist-04',
    artistName: 'Mia Chen',
    price: 980.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-02-11T13:00:00.000Z',
    image: '/arts/art10.jpg',
    views: 1340,
    likes: 220,
    income: 1800.0,
    description: 'Urban photography series.'
    ,
    forMuseum: true,
    museumId: 'museum-01'
  },
  {
    id: 'art-011',
    title: 'Night Bloom',
    artistId: 'artist-05',
    artistName: 'Samuel Nkusi',
    price: 270.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-01-20T07:30:00.000Z',
    image: '/arts/art11.jpg',
    views: 420,
    likes: 88,
    income: 340.0,
    description: 'Textured painting inspired by nocturnal flora.'
  },
  {
    id: 'art-012',
    title: 'River Merchants',
    artistId: 'artist-06',
    artistName: 'Elena Rossi',
    price: 510.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2024-12-05T11:00:00.000Z',
    image: '/arts/art12.jpg',
    views: 980,
    likes: 140,
    income: 760.0,
    description: 'Vibrant marketplace scene in gouache.'
  }
  ,
  {
    id: 'art-013',
    title: 'Starlit Balcony',
    artistId: 'artist-01',
    artistName: 'Amina Uwimana',
    price: 350.0,
    currency: 'USD',
    approved: true,
    status: 'rejected',
    createdAt: '2025-11-15T18:20:00.000Z',
    image: '/arts/art13.jpg',
    views: 220,
    likes: 34,
    income: 420.0,
    description: 'Intimate night scene painted with loose brushwork.'
  },
  {
    id: 'art-014',
    title: 'Concrete Jungle',
    artistId: 'artist-02',
    artistName: 'Jean Mukasa',
    price: 640.0,
    currency: 'USD',
    approved: true,
    status: 'approved',
    createdAt: '2025-10-05T09:00:00.000Z',
    image: '/arts/art14.jpg',
    views: 560,
    likes: 88,
    income: 980.0,
    description: 'High-contrast urban study in gritty tones.'
  },
  {
    id: 'art-015',
    title: 'Cerulean Daydream',
    artistId: 'artist-03',
    artistName: 'Luis Ortega',
    price: 275.0,
    currency: 'USD',
    approved: false,
    status: 'pending',
    createdAt: '2025-11-20T07:45:00.000Z',
    image: '/arts/art15.jpg',
    views: 48,
    likes: 5,
    income: 0.0,
    description: 'Soft tonalist piece exploring blue gradients.'
  }
];

export default sampleArtworks;
