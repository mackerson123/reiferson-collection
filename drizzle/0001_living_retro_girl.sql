CREATE TABLE "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"about_title" text NOT NULL,
	"about_content" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
