CREATE TABLE "users_sessions" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" text PRIMARY KEY NOT NULL,
  "created_at" text,
  "expires_at" text NOT NULL,
  FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
);
CREATE INDEX "users_sessions_order_idx" ON "users_sessions" ("_order");
CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" ("_parent_id");
CREATE TABLE "users" (
  "id" integer PRIMARY KEY NOT NULL,
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "email" text NOT NULL,
  "reset_password_token" text,
  "reset_password_expiration" text,
  "salt" text,
  "hash" text,
  "login_attempts" numeric DEFAULT 0,
  "lock_until" text
);
CREATE INDEX "users_updated_at_idx" ON "users" ("updated_at");
CREATE INDEX "users_created_at_idx" ON "users" ("created_at");
CREATE UNIQUE INDEX "users_email_idx" ON "users" ("email");
CREATE TABLE "media" (
  "id" integer PRIMARY KEY NOT NULL,
  "alt" text NOT NULL,
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "url" text,
  "thumbnail_u_r_l" text,
  "filename" text,
  "mime_type" text,
  "filesize" numeric,
  "width" numeric,
  "height" numeric
);
CREATE INDEX "media_updated_at_idx" ON "media" ("updated_at");
CREATE INDEX "media_created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX "media_filename_idx" ON "media" ("filename");
CREATE TABLE "posts_tags" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" text PRIMARY KEY NOT NULL,
  "tag" text,
  FOREIGN KEY ("_parent_id") REFERENCES "posts"("id") ON UPDATE no action ON DELETE cascade
);
CREATE INDEX "posts_tags_order_idx" ON "posts_tags" ("_order");
CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" ("_parent_id");
CREATE TABLE "posts" (
  "id" integer PRIMARY KEY NOT NULL,
  "slug" text,
  "hero_image_id" integer,
  "category" text,
  "author" text,
  "published_date" text,
  "status" text DEFAULT 'draft',
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "_status" text DEFAULT 'draft',
  FOREIGN KEY ("hero_image_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" ("slug");
CREATE INDEX "posts_hero_image_idx" ON "posts" ("hero_image_id");
CREATE INDEX "posts_updated_at_idx" ON "posts" ("updated_at");
CREATE INDEX "posts_created_at_idx" ON "posts" ("created_at");
CREATE INDEX "posts__status_idx" ON "posts" ("_status");
CREATE TABLE "posts_locales" (
  "title" text,
  "excerpt" text,
  "content" text,
  "id" integer PRIMARY KEY NOT NULL,
  "_locale" text NOT NULL,
  "_parent_id" integer NOT NULL,
  FOREIGN KEY ("_parent_id") REFERENCES "posts"("id") ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" ("_locale","_parent_id");
CREATE TABLE "_posts_v_version_tags" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY NOT NULL,
  "tag" text,
  "_uuid" text,
  FOREIGN KEY ("_parent_id") REFERENCES "_posts_v"("id") ON UPDATE no action ON DELETE cascade
);
CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" ("_order");
CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" ("_parent_id");
CREATE TABLE "_posts_v" (
  "id" integer PRIMARY KEY NOT NULL,
  "parent_id" integer,
  "version_slug" text,
  "version_hero_image_id" integer,
  "version_category" text,
  "version_author" text,
  "version_published_date" text,
  "version_status" text DEFAULT 'draft',
  "version_updated_at" text,
  "version_created_at" text,
  "version__status" text DEFAULT 'draft',
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "snapshot" integer,
  "published_locale" text,
  "latest" integer,
  FOREIGN KEY ("parent_id") REFERENCES "posts"("id") ON UPDATE no action ON DELETE set null,
  FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE set null
);
CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" ("parent_id");
CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" ("version_slug");
CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" ("version_hero_image_id");
CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" ("version_updated_at");
CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" ("version_created_at");
CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" ("version__status");
CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" ("created_at");
CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" ("updated_at");
CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" ("snapshot");
CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" ("published_locale");
CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" ("latest");
CREATE TABLE "_posts_v_locales" (
  "version_title" text,
  "version_excerpt" text,
  "version_content" text,
  "id" integer PRIMARY KEY NOT NULL,
  "_locale" text NOT NULL,
  "_parent_id" integer NOT NULL,
  FOREIGN KEY ("_parent_id") REFERENCES "_posts_v"("id") ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" ("_locale","_parent_id");
CREATE TABLE "payload_kv" (
  "id" integer PRIMARY KEY NOT NULL,
  "key" text NOT NULL,
  "data" text NOT NULL
);
CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" ("key");
CREATE TABLE "payload_locked_documents" (
  "id" integer PRIMARY KEY NOT NULL,
  "global_slug" text,
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" ("global_slug");
CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" ("updated_at");
CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" ("created_at");
CREATE TABLE "payload_locked_documents_rels" (
  "id" integer PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" text NOT NULL,
  "users_id" integer,
  "media_id" integer,
  "posts_id" integer,
  FOREIGN KEY ("parent_id") REFERENCES "payload_locked_documents"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("users_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("media_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON UPDATE no action ON DELETE cascade
);
CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" ("order");
CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" ("parent_id");
CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" ("path");
CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" ("users_id");
CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" ("media_id");
CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" ("posts_id");
CREATE TABLE "payload_preferences" (
  "id" integer PRIMARY KEY NOT NULL,
  "key" text,
  "value" text,
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" ("key");
CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" ("updated_at");
CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" ("created_at");
CREATE TABLE "payload_preferences_rels" (
  "id" integer PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" text NOT NULL,
  "users_id" integer,
  FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("users_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
);
CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" ("order");
CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" ("parent_id");
CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" ("path");
CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" ("users_id");
CREATE TABLE "payload_migrations" (
  "id" integer PRIMARY KEY NOT NULL,
  "name" text,
  "batch" numeric,
  "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" ("updated_at");
CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" ("created_at");
INSERT INTO "payload_migrations" ("name", "batch", "updated_at", "created_at") VALUES ('20260827_220949', 1, datetime('now'), datetime('now'));
