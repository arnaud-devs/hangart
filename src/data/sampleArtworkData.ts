import type { Artwork } from "@/components/ArtworkCard"; // adjust path if needed

export const sampleArtworks: Artwork[] = [
  {
    id: "1",
    title: "Cloud Studies I",
    artist: "Tiana M.",
    image: "/artwork/11242715-FOEPBRHF-7.jpeg",
    category: "Cloud Studies",       // public/artwork/art1.jpg
    price: "450",
  },
  {
    id: "2",
    title: "Still Life on Easel",
    artist: "R. Painter",
    image: "/artwork/pexels-daiangan-102127.jpg",
    category: "Still Life",
    price: "1200",
  },
  {
    id: "3",
    title: "Abstract Burst",
    artist: "L. Color",
    image: "/artwork/pexels-jon-bagnato-38056472-13371430.jpg",        // svg is OK too
    price: "800",
  },
  {
    id: "4",
    title: "Ocean Whisper",
    artist: "A. Wave",
    category: "Seascape",
    image: "/artwork/pexels-steve-16415177.jpg", // you can also provide the full path
    price: "2300",
  },
];