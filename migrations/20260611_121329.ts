import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` RENAME COLUMN "street" TO "physical_address";`)
  await db.run(sql`CREATE TABLE \`pages_blocks_onboard\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_onboard_order_idx\` ON \`pages_blocks_onboard\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_onboard_parent_id_idx\` ON \`pages_blocks_onboard\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_onboard_path_idx\` ON \`pages_blocks_onboard\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_onboard_image_idx\` ON \`pages_blocks_onboard\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_onboard\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_onboard_order_idx\` ON \`_pages_v_blocks_onboard\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_onboard_parent_id_idx\` ON \`_pages_v_blocks_onboard\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_onboard_path_idx\` ON \`_pages_v_blocks_onboard\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_onboard_image_idx\` ON \`_pages_v_blocks_onboard\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`users_vehicles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`vehicle_registration\` text,
  	\`vehicle_model\` text,
  	\`vehicle_colour\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_vehicles_order_idx\` ON \`users_vehicles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_vehicles_parent_id_idx\` ON \`users_vehicles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`previous_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`full_name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`reset_uuid\` text,
  	\`reset\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`previous_users_updated_at_idx\` ON \`previous_users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`previous_users_created_at_idx\` ON \`previous_users\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`exports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`format\` text DEFAULT 'csv' NOT NULL,
  	\`limit\` numeric,
  	\`page\` numeric DEFAULT 1,
  	\`sort\` text,
  	\`sort_order\` text,
  	\`drafts\` text DEFAULT 'yes',
  	\`collection_slug\` text DEFAULT 'previousUsers' NOT NULL,
  	\`where\` text DEFAULT '{}',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`exports_updated_at_idx\` ON \`exports\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`exports_created_at_idx\` ON \`exports\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`exports_filename_idx\` ON \`exports\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`exports_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`exports\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exports_texts_order_parent\` ON \`exports_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`imports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`collection_slug\` text DEFAULT 'previousUsers' NOT NULL,
  	\`import_mode\` text,
  	\`match_field\` text DEFAULT 'id',
  	\`status\` text DEFAULT 'pending',
  	\`summary_imported\` numeric,
  	\`summary_updated\` numeric,
  	\`summary_total\` numeric,
  	\`summary_issues\` numeric,
  	\`summary_issue_details\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`imports_updated_at_idx\` ON \`imports\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`imports_created_at_idx\` ON \`imports\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`imports_filename_idx\` ON \`imports\` (\`filename\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`arrears_amount\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`city\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`province\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`postal_code\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`country\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`previous_users_id\` integer REFERENCES previous_users(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_previous_users_id_idx\` ON \`payload_locked_documents_rels\` (\`previous_users_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_onboard\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_onboard\`;`)
  await db.run(sql`DROP TABLE \`users_vehicles\`;`)
  await db.run(sql`DROP TABLE \`previous_users\`;`)
  await db.run(sql`DROP TABLE \`exports\`;`)
  await db.run(sql`DROP TABLE \`exports_texts\`;`)
  await db.run(sql`DROP TABLE \`imports\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	\`bookings_id\` integer,
  	\`booking_history_id\` integer,
  	\`catch_returns_id\` integer,
  	\`email_subscribers_id\` integer,
  	\`festivals_id\` integer,
  	\`locations_id\` integer,
  	\`media_id\` integer,
  	\`new_memberships_id\` integer,
  	\`orders_id\` integer,
  	\`payments_id\` integer,
  	\`pages_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`booking_history_id\`) REFERENCES \`booking_history\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`catch_returns_id\`) REFERENCES \`catch_returns\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_subscribers_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`festivals_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`new_memberships_id\`) REFERENCES \`new_memberships\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payments_id\`) REFERENCES \`payments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "admins_id", "bookings_id", "booking_history_id", "catch_returns_id", "email_subscribers_id", "festivals_id", "locations_id", "media_id", "new_memberships_id", "orders_id", "payments_id", "pages_id", "users_id") SELECT "id", "order", "parent_id", "path", "admins_id", "bookings_id", "booking_history_id", "catch_returns_id", "email_subscribers_id", "festivals_id", "locations_id", "media_id", "new_memberships_id", "orders_id", "payments_id", "pages_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_admins_id_idx\` ON \`payload_locked_documents_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_booking_history_id_idx\` ON \`payload_locked_documents_rels\` (\`booking_history_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_catch_returns_id_idx\` ON \`payload_locked_documents_rels\` (\`catch_returns_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`email_subscribers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_festivals_id_idx\` ON \`payload_locked_documents_rels\` (\`festivals_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_new_memberships_id_idx\` ON \`payload_locked_documents_rels\` (\`new_memberships_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`payments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`street\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`city\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`province\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`postal_code\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`country\` text;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`physical_address\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`arrears_amount\`;`)
}
