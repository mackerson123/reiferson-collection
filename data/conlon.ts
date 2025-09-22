import { Work } from "../lib/types";

export const conlonWorks: Work[] = Array.from({ length: 30 }, (_, i) => ({
  id: `conlon-${String(i + 1).padStart(3, "0")}`,
  title: `Charles M. Conlon Baseball Photograph ${i + 1}`,
  artist: "Charles M. Conlon",
  date: "c. 1910-1930",
  medium: "Gelatin silver print",
  dimensions: "8 x 10 in.",
  imageUrl: `/placeholder.svg?height=400&width=400&query=charles conlon vintage baseball photograph ${
    i + 1
  }`,
  collectionId: "conlon",
  narrative: `Charles Martin Conlon was one of the most prolific and influential baseball photographers of the early 20th century. This photograph represents his distinctive style and technical mastery in capturing the essence of America's pastime.`,
  description: `Professional baseball photograph by Charles M. Conlon, known for his iconic images of early baseball stars and his technical innovation in sports photography.`,
  provenance: "Charles M. Conlon estate collection",
  exhibition:
    'Featured in various baseball photography exhibitions including "The Golden Age of Baseball Photography" traveling exhibition.',
}));
