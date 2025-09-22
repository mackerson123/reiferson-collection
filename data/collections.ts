import { Collection, CollectionData } from "../lib/types";
import { allColorLineWorks } from "./color-line";
import { conlonWorks } from "./conlon";
import { negroLeaguesWorks } from "./negro-leagues";
import { americanIconWorks } from "./american-icon";

export const collections: Collection[] = [
  {
    id: "color-line",
    name: "The color line",
    description:
      "A comprehensive examination of racial segregation and integration in American baseball, documenting the experiences of Black players before, during, and after the breaking of the color barrier.",
    curatorNote:
      "This collection traces the complex history of race in baseball, from the early integrated teams of the 1880s through Jackie Robinson's breakthrough and beyond. Each photograph tells part of the larger story of American civil rights through the lens of our national pastime.",
    works: allColorLineWorks,
  },
  {
    id: "conlon",
    name: "Charles M. Conlon",
    description:
      "The definitive collection of baseball photography by Charles Martin Conlon, whose innovative techniques and artistic vision captured the golden age of baseball from 1910 to 1942.",
    curatorNote:
      "Charles M. Conlon revolutionized sports photography with his technical innovations and artistic eye. His work provides an unparalleled visual record of baseball's early legends and the evolution of the game itself.",
    works: conlonWorks,
  },
  {
    id: "negro-leagues",
    name: "The Negro Leagues",
    description:
      "A tribute to the players, teams, and culture of the Negro Leagues, showcasing the extraordinary talent and resilience of Black professional baseball during the era of segregation.",
    curatorNote:
      "The Negro Leagues represented more than just baseball—they were institutions of Black excellence, community pride, and cultural expression. These photographs preserve the memory of a parallel baseball universe that produced some of the greatest players in the sport's history.",
    works: negroLeaguesWorks,
  },
  {
    id: "american-icon",
    name: "American icon",
    description:
      "Baseball as the embodiment of American culture and values, featuring iconic moments, legendary players, and the cultural significance of America's pastime.",
    curatorNote:
      "Baseball has served as a mirror for American society, reflecting our values, struggles, and aspirations. This collection celebrates the iconic status of the sport and its role in shaping American identity.",
    works: americanIconWorks,
  },
];

export const collectionData: CollectionData = {
  collections,
  totalWorks: collections.reduce(
    (total, collection) => total + collection.works.length,
    0
  ),
};

// Helper functions for accessing data
export const getCollectionById = (id: string): Collection | undefined => {
  return collections.find((collection) => collection.id === id);
};

export const getWorkById = (
  workId: string
): { work: any; collection: Collection } | undefined => {
  for (const collection of collections) {
    const work = collection.works.find((w) => w.id === workId);
    if (work) {
      return { work, collection };
    }
  }
  return undefined;
};

export const getAllWorks = () => {
  return collections.flatMap((collection) => collection.works);
};

export const getWorksByCollection = (collectionId: string) => {
  const collection = getCollectionById(collectionId);
  return collection?.works || [];
};
