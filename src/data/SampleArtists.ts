export type Artist = {
  id: string;
  userId?: string; // optional link to a user account
  name: string;
  bio?: string;
  avatarUrl?: string; // small avatar image
  profilePhotoUrl?: string; // larger profile photo (optional)
  website?: string;
  specialization?: string; // e.g., painting, sculpture
  experienceYears?: number;
  country?: string;
  city?: string;
  verifiedByAdmin?: boolean;
  socialLinks?: { platform: string; url: string }[]; // more explicit than `type`
  artworks?: Array<string | number>;
};

export const sampleArtists: Artist[] = [
  {
    id: 'artist-01',
    userId: 'amina',
    name: 'Amina Uwimana',
    bio: 'Amina Uwimana paints vibrant urban and market scenes inspired by East African life.',
    avatarUrl: '/avatars/amina.jpg',
    profilePhotoUrl: '/profiles/amina.jpg',
    website: 'https://amina-art.example',
    specialization: 'Painting',
    experienceYears: 7,
    country: 'Rwanda',
    city: 'Kigali',
    verifiedByAdmin: true,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/amina' },
    ],
    artworks: ['art-001', 'art-003', 'art-013'],
  },
  {
    id: 'artist-02',
    userId: 'jean',
    name: 'Jean Mukasa',
    bio: 'Jean Mukasa works with mixed media and subtle palettes, often exploring memory and place.',
    avatarUrl: '/avatars/jean.jpg',
    profilePhotoUrl: '/profiles/jean.jpg',
    website: 'https://jeanmukasa.studio',
    specialization: 'Mixed media',
    experienceYears: 9,
    country: 'Kenya',
    city: 'Nairobi',
    verifiedByAdmin: false,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/jeanmukasa' },
    ],
    artworks: ['art-002', 'art-007', 'art-014'],
  },
  {
    id: 'artist-03',
    userId: 'luis',
    name: 'Luis Ortega',
    bio: 'Luis Ortega is an abstract artist focused on surface and gesture with a strong international presence.',
    avatarUrl: '/avatars/luis.jpg',
    profilePhotoUrl: '/profiles/luis.jpg',
    website: 'https://luisortega.art',
    specialization: 'Abstract',
    experienceYears: 12,
    country: 'Spain',
    city: 'Barcelona',
    verifiedByAdmin: true,
    socialLinks: [
      { platform: 'website', url: 'https://luisortega.art' },
    ],
    artworks: ['art-004', 'art-009', 'art-015'],
  },
  {
    id: 'artist-04',
    userId: 'mia',
    name: 'Mia Chen',
    bio: 'Mia Chen produces striking photographic and urban studies that play with light and architecture.',
    avatarUrl: '/avatars/mia.jpg',
    profilePhotoUrl: '/profiles/mia.jpg',
    website: 'https://miachen.photo',
    specialization: 'Photography',
    experienceYears: 5,
    country: 'China',
    city: 'Shanghai',
    verifiedByAdmin: false,
    socialLinks: [],
    artworks: ['art-005', 'art-010'],
  },
  {
    id: 'artist-05',
    userId: 'samuel',
    name: 'Samuel Nkusi',
    bio: 'Samuel Nkusi experiments with digital collage and texture-driven works influenced by local craft.',
    avatarUrl: '/avatars/samuel.jpg',
    profilePhotoUrl: '/profiles/samuel.jpg',
    website: '',
    specialization: 'Digital collage',
    experienceYears: 4,
    country: 'Uganda',
    city: 'Kampala',
    verifiedByAdmin: false,
    socialLinks: [],
    artworks: ['art-006', 'art-011'],
  },
  {
    id: 'artist-06',
    userId: 'elena',
    name: 'Elena Rossi',
    bio: 'Elena Rossi paints intimate figurative works and market scenes with European sensibility.',
    avatarUrl: '/avatars/elena.jpg',
    profilePhotoUrl: '/profiles/elena.jpg',
    website: 'https://elena-rossi.art',
    specialization: 'Figurative',
    experienceYears: 10,
    country: 'Italy',
    city: 'Milan',
    verifiedByAdmin: true,
    socialLinks: [],
    artworks: ['art-008', 'art-012'],
  },
];

export default sampleArtists;
