import { Work } from "../lib/types";

export const americanIconWorks: Work[] = Array.from({ length: 30 }, (_, i) => ({
  id: `american-icon-${String(i + 1).padStart(3, "0")}`,
  title: `American Baseball Icon Photograph ${i + 1}`,
  artist: "Various photographers",
  date: "c. 1900-1960",
  medium: "Gelatin silver print",
  dimensions: "8 x 10 in.",
  imageUrl: `/placeholder.svg?height=400&width=400&query=american icon vintage baseball photograph ${
    i + 1
  }`,
  collectionId: "american-icon",
  narrative: `Baseball has been called America's pastime, and these photographs capture the iconic moments, players, and cultural significance that made the sport a defining element of American identity. From legendary players to historic moments, these images represent baseball's role in shaping American culture.`,
  description: `Iconic baseball photograph representing the sport's significance in American culture and history, featuring legendary players, historic moments, or culturally significant baseball imagery.`,
  provenance: "Various American sports photography collections and archives",
  exhibition:
    "Featured in exhibitions celebrating American sports heritage and cultural history.",
  relatedObjects: [
    "Baseball memorabilia",
    "Historic equipment",
    "Programs and tickets",
    "Press photographs",
  ],
}));
