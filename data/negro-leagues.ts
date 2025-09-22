import { Work } from "../lib/types";

export const negroLeaguesWorks: Work[] = Array.from({ length: 30 }, (_, i) => ({
  id: `negro-leagues-${String(i + 1).padStart(3, "0")}`,
  title: `Negro Leagues Baseball Photograph ${i + 1}`,
  artist: "Various photographers",
  date: "c. 1920-1950",
  medium: "Gelatin silver print",
  dimensions: "8 x 10 in.",
  imageUrl: `/placeholder.svg?height=400&width=400&query=negro leagues vintage baseball photograph ${
    i + 1
  }`,
  collectionId: "negro-leagues",
  narrative: `The Negro Leagues represented one of the most important chapters in American baseball history, providing opportunities for Black athletes during the era of segregation. This photograph documents the skill, professionalism, and cultural significance of these leagues that operated parallel to Major League Baseball.`,
  description: `Historical photograph documenting Negro League baseball, showcasing the talent and organization of Black professional baseball during the segregation era.`,
  provenance: "Negro League historical archives and private collections",
  exhibition:
    "Part of traveling exhibitions on Negro League history and African American sports heritage.",
  relatedObjects: ["Uniforms", "Equipment", "Programs", "Team photographs"],
}));
