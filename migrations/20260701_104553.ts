import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`festivals\` RENAME COLUMN "exta_meals" TO "extra_meals";`)
  await db.run(sql`CREATE TABLE \`festival_entries_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`full_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`mobile\` text NOT NULL,
  	\`size\` text NOT NULL,
  	\`extra_meals\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`festival_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`festival_entries_team_members_order_idx\` ON \`festival_entries_team_members\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`festival_entries_team_members_parent_id_idx\` ON \`festival_entries_team_members\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`festival_entries_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`festival_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`festival_entries_line_items_order_idx\` ON \`festival_entries_line_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`festival_entries_line_items_parent_id_idx\` ON \`festival_entries_line_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`festival_entries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_type\` text DEFAULT 'festivalEntry' NOT NULL,
  	\`festival_id\` integer NOT NULL,
  	\`team_name\` text NOT NULL,
  	\`total_amount\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`festival_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`festival_entries_festival_idx\` ON \`festival_entries\` (\`festival_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`festival_entries_updated_at_idx\` ON \`festival_entries\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`festival_entries_created_at_idx\` ON \`festival_entries\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_blocks_festival\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`festival_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`festival_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_festival_order_idx\` ON \`pages_blocks_festival\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_festival_parent_id_idx\` ON \`pages_blocks_festival\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_festival_path_idx\` ON \`pages_blocks_festival\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_festival_festival_idx\` ON \`pages_blocks_festival\` (\`festival_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_festival\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`festival_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`festival_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_festival_order_idx\` ON \`_pages_v_blocks_festival\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_festival_parent_id_idx\` ON \`_pages_v_blocks_festival\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_festival_path_idx\` ON \`_pages_v_blocks_festival\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_festival_festival_idx\` ON \`_pages_v_blocks_festival\` (\`festival_id\`);`,
  )
  await db.run(sql`DROP TABLE \`festivals_team_members\`;`)
  await db.run(sql`DROP TABLE \`festivals_line_items\`;`)
  await db.run(sql`ALTER TABLE \`festivals\` ADD \`blurb\` text;`)
  await db.run(
    sql`ALTER TABLE \`festivals\` ADD \`sponsor_image_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`festivals_sponsor_image_idx\` ON \`festivals\` (\`sponsor_image_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`festivals\` DROP COLUMN \`product_type\`;`)
  await db.run(sql`ALTER TABLE \`festivals\` DROP COLUMN \`total_amount\`;`)
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`festival_entries_id\` integer REFERENCES festival_entries(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_festival_entries_id_idx\` ON \`payload_locked_documents_rels\` (\`festival_entries_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`festivals_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`full_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`mobile\` text NOT NULL,
  	\`garment_size\` text NOT NULL,
  	\`hat_size\` text NOT NULL,
  	\`extra_meals\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`festivals_team_members_order_idx\` ON \`festivals_team_members\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`festivals_team_members_parent_id_idx\` ON \`festivals_team_members\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`festivals_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`festivals_line_items_order_idx\` ON \`festivals_line_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`festivals_line_items_parent_id_idx\` ON \`festivals_line_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP TABLE \`festival_entries_team_members\`;`)
  await db.run(sql`DROP TABLE \`festival_entries_line_items\`;`)
  await db.run(sql`DROP TABLE \`festival_entries\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_festival\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_festival\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_festivals\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_type\` text DEFAULT 'festivalEntry' NOT NULL,
  	\`festival_name\` text NOT NULL,
  	\`bookings_open\` integer DEFAULT false,
  	\`number_of_teams\` numeric,
  	\`entries_per_team\` numeric,
  	\`start_date\` text,
  	\`end_date\` text,
  	\`event_duration\` numeric,
  	\`price\` numeric,
  	\`exta_meals\` numeric,
  	\`total_amount\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_festivals\`("id", "product_type", "festival_name", "bookings_open", "number_of_teams", "entries_per_team", "start_date", "end_date", "event_duration", "price", "exta_meals", "total_amount", "updated_at", "created_at") SELECT "id", "product_type", "festival_name", "bookings_open", "number_of_teams", "entries_per_team", "start_date", "end_date", "event_duration", "price", "exta_meals", "total_amount", "updated_at", "created_at" FROM \`festivals\`;`,
  )
  await db.run(sql`DROP TABLE \`festivals\`;`)
  await db.run(sql`ALTER TABLE \`__new_festivals\` RENAME TO \`festivals\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`festivals_updated_at_idx\` ON \`festivals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`festivals_created_at_idx\` ON \`festivals\` (\`created_at\`);`)
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
  	\`previous_users_id\` integer,
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
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`previous_users_id\`) REFERENCES \`previous_users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "admins_id", "bookings_id", "booking_history_id", "catch_returns_id", "email_subscribers_id", "festivals_id", "locations_id", "media_id", "new_memberships_id", "orders_id", "payments_id", "pages_id", "users_id", "previous_users_id") SELECT "id", "order", "parent_id", "path", "admins_id", "bookings_id", "booking_history_id", "catch_returns_id", "email_subscribers_id", "festivals_id", "locations_id", "media_id", "new_memberships_id", "orders_id", "payments_id", "pages_id", "users_id", "previous_users_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_admins_id_idx\` ON \`payload_locked_documents_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_booking_history_id_idx\` ON \`payload_locked_documents_rels\` (\`booking_history_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_catch_returns_id_idx\` ON \`payload_locked_documents_rels\` (\`catch_returns_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_email_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`email_subscribers_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_festivals_id_idx\` ON \`payload_locked_documents_rels\` (\`festivals_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_new_memberships_id_idx\` ON \`payload_locked_documents_rels\` (\`new_memberships_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`payments_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_previous_users_id_idx\` ON \`payload_locked_documents_rels\` (\`previous_users_id\`);`,
  )
}
