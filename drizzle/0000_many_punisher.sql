CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"curator_note" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text,
	"date" text,
	"medium" text,
	"dimensions" text,
	"description" text,
	"narrative" text,
	"provenance" text,
	"exhibition" text,
	"related_objects" text[],
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"collection_id" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;