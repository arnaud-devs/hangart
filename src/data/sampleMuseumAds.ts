export type MuseumAd = {
  id: string;
  museumName: string;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  createdAt?: string;
};

const sampleMuseumAds: MuseumAd[] = [
  {
    id: 'ad-001',
    museumName: 'National Art Museum',
    title: 'Impressionists through Time',
    description: 'A curated selection of impressionist works from the 19th century to modern reinterpretations.',
    url: 'https://example.com/exhibitions/impressionists',
    image: '/museums/exhibit1.jpg',
    createdAt: '2025-10-01T08:00:00.000Z'
  },
  {
    id: 'ad-002',
    museumName: 'Modern Art Center',
    title: 'Light & Motion',
    description: 'An exploration of kinetic sculpture and light installations.',
    url: 'https://example.com/exhibitions/light-motion',
    image: '/museums/exhibit2.jpg',
    createdAt: '2025-09-14T08:00:00.000Z'
  },
  {
    id: 'ad-003',
    museumName: 'Museum of World Cultures',
    title: 'Textiles of the World',
    description: 'A traveling exhibition showcasing historic and contemporary textiles.',
    url: 'https://example.com/exhibitions/textiles',
    image: '/museums/exhibit3.jpg',
    createdAt: '2025-08-20T08:00:00.000Z'
  }
];

export default sampleMuseumAds;
