export type Artwork = {
  id: string | number;
  title: string;
  artistName?: string;
  artistId?: string | number;
  image?: string;
  year?: string | number;
  medium?: string;
  size?: string;
  price?: string | number;
  currency?: string;
  description?: string;
  shipping?: string;
  artistBio?: string;
};

export const sampleArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Blooming Horizon',
    artistName: 'Ava Park',
    artistId: 'ava-park',
    image: '/arts/art2.jpeg',
    year: 2024,
    medium: 'Oil on canvas',
    size: '80 x 60 cm',
    price: 2200,
    currency: '$',
    description: 'A vivid study of light and texture inspired by early morning gardens.',
    shipping: 'Ships within 7-10 business days. Returns accepted within 14 days in original condition.',
    artistBio: 'Ava Park is a contemporary painter exploring color relationships and landscape abstraction.'
  },
  {
    id: '2',
    title: 'Quiet Geometry',
    artistName: 'Liam Chen',
    artistId: 'liam-chen',
    image: '/arts/art1.jpeg',
    year: 2023,
    medium: 'Acrylic on panel',
    size: '50 x 50 cm',
    price: 950,
    currency: '$',
    description: 'A minimal composition exploring balance and negative space.',
    shipping: 'Local pickup available; shipping calculated at checkout.',
    artistBio: 'Liam Chen focuses on pared-back compositions that emphasize form and material.'
  },
  {
    id: '3',
    title: 'Nocturne in Teal',
    artistName: 'Ava Park',
    artistId: 'ava-park',
    image: '/arts/art3.jpeg',
    year: 2022,
    medium: 'Digital print',
    size: '60 x 40 cm',
    price: 350,
    currency: '$',
    description: 'A moody, layered work that blends digital texture with painterly gestures.',
    shipping: 'Ships framed. Return policy: 30 days for full refund.',
    artistBio: 'Ava Park is a contemporary painter exploring color relationships and landscape abstraction.'
  },
  {
    id: '4',
    title: 'Sunlight Fragments',
    artistName: 'Maya Rossi',
    artistId: 'maya-rossi',
    image: '/arts/art4.jpeg',
    year: 2021,
    medium: 'Mixed media',
    size: '100 x 70 cm',
    price: 4200,
    currency: '$',
    description: 'Large-scale mixed media piece capturing ephemeral light patterns.',
    shipping: 'White-glove shipping available for large works.',
    artistBio: 'Maya Rossi blends found materials with paint and collage.'
  }
];

export default sampleArtworks;
