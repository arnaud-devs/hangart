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
    id: 'ava-park',
    userId: 'ava',
    name: 'Ava Park',
    bio: 'Ava Park is a contemporary painter exploring color relationships and landscape abstraction.',
    avatarUrl: '/avatar-ava.jpg',
    profilePhotoUrl: '/profile-ava.jpg',
    website: 'https://avapark.art',
    specialization: 'Painting',
    experienceYears: 6,
    country: 'USA',
    city: 'Portland',
    verifiedByAdmin: true,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/avapark' },
      { platform: 'website', url: 'https://avapark.art' },
    ],
    artworks: ['1', '3'],
  },
  {
    id: 'liam-chen',
    userId: 'liam',
    name: 'Liam Chen',
    bio: 'Liam Chen focuses on pared-back compositions that emphasize form and material.',
    avatarUrl: '/avatar-liam.jpg',
    profilePhotoUrl: '/profile-liam.jpg',
    website: 'https://liamchen.studio',
    specialization: 'Mixed media',
    experienceYears: 8,
    country: 'Canada',
    city: 'Toronto',
    verifiedByAdmin: false,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/liamchen' },
    ],
    artworks: ['2'],
  },
];

export default sampleArtists;
