export type Artist = {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: { type: string; url: string }[];
  artworks?: Array<string | number>;
};

export const sampleArtists: Artist[] = [
  {
    id: 'ava-park',
    name: 'Ava Park',
    bio: 'Ava Park is a contemporary painter exploring color relationships and landscape abstraction.',
    avatarUrl: '/avatar-ava.jpg',
    socialLinks: [
      { type: 'instagram', url: 'https://instagram.com/avapark' },
    ],
    artworks: ['1', '3'],
  },
  {
    id: 'liam-chen',
    name: 'Liam Chen',
    bio: 'Liam Chen focuses on pared-back compositions that emphasize form and material.',
    avatarUrl: '/avatar-liam.jpg',
    socialLinks: [],
    artworks: ['2'],
  },
];

export default sampleArtists;
