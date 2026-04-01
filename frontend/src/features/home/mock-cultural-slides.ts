//mock-cultural-slides.ts
export type CulturalSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

export const mockCulturalSlides: CulturalSlide[] = [
  {
    id: "slide-1",
    image: "/mock/kab_7.jpg",
    title: "Kikiga Dance Traditions of Kigezi",
    subtitle:
      "Experience the energy, rhythm, and storytelling of traditional dance rooted in Uganda’s Kigezi heritage",
  },
  {
    id: "slide-2",
    image: "/mock/kab_6.jpg",
    title: "Experience culture beyond sightseeing",
    subtitle:
      "Explore traditions, performances, and destination stories that connect visitors to the heart of local communities.",
  },
  {
    id: "slide-3",
    image: "/mock/kab_5.jpg",
    title: "Taste culture through authentic local cuisine",
    subtitle:
      "Connect with local providers and discover traditional food and drinks prepared with heritage, care, and authentic methods",
  },
  {
    id: "slide-4",
    image: "/mock/kigezi_mountain.jpg",
    title: "Discover the cultural sites in Kigezi",
    subtitle:
      "Browse, connect, and book meaningful experiences shared by cultural service providers.",
  },
];