import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  curatorNote: text("curator_note"),
  isPublished: boolean("is_published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const works = pgTable("works", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  date: text("date"),
  medium: text("medium"),
  dimensions: text("dimensions"),
  description: text("description"),
  narrative: text("narrative"),
  provenance: text("provenance"),
  exhibition: text("exhibition"),
  relatedObjects: text("related_objects").array(),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  collectionId: text("collection_id").references(() => collections.id),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  aboutTitle: text("about_title").notNull(),
  aboutContent: text("about_content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Work = typeof works.$inferSelect;
export type NewWork = typeof works.$inferInsert;
export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;
