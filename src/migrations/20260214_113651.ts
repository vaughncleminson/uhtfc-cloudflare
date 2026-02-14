import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`admins_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_sessions_order_idx\` ON \`admins_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`admins_sessions_parent_id_idx\` ON \`admins_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`admins\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`role\` text DEFAULT 'viewer',
  	\`mfa_mfa_settings\` text DEFAULT '{"enabled":false,"mfaSecret":"","mfaURL":""}',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_updated_at_idx\` ON \`admins\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`admins_created_at_idx\` ON \`admins\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`admins_email_idx\` ON \`admins\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`description\` text,
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
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_square_url\` text,
  	\`sizes_square_width\` numeric,
  	\`sizes_square_height\` numeric,
  	\`sizes_square_mime_type\` text,
  	\`sizes_square_filesize\` numeric,
  	\`sizes_square_filename\` text,
  	\`sizes_small_url\` text,
  	\`sizes_small_width\` numeric,
  	\`sizes_small_height\` numeric,
  	\`sizes_small_mime_type\` text,
  	\`sizes_small_filesize\` numeric,
  	\`sizes_small_filename\` text,
  	\`sizes_medium_url\` text,
  	\`sizes_medium_width\` numeric,
  	\`sizes_medium_height\` numeric,
  	\`sizes_medium_mime_type\` text,
  	\`sizes_medium_filesize\` numeric,
  	\`sizes_medium_filename\` text,
  	\`sizes_large_url\` text,
  	\`sizes_large_width\` numeric,
  	\`sizes_large_height\` numeric,
  	\`sizes_large_mime_type\` text,
  	\`sizes_large_filesize\` numeric,
  	\`sizes_large_filename\` text,
  	\`sizes_xlarge_url\` text,
  	\`sizes_xlarge_width\` numeric,
  	\`sizes_xlarge_height\` numeric,
  	\`sizes_xlarge_mime_type\` text,
  	\`sizes_xlarge_filesize\` numeric,
  	\`sizes_xlarge_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_square_sizes_square_filename_idx\` ON \`media\` (\`sizes_square_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_small_sizes_small_filename_idx\` ON \`media\` (\`sizes_small_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_medium_sizes_medium_filename_idx\` ON \`media\` (\`sizes_medium_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_large_sizes_large_filename_idx\` ON \`media\` (\`sizes_large_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_xlarge_sizes_xlarge_filename_idx\` ON \`media\` (\`sizes_xlarge_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`CREATE TABLE \`orders_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_line_items_order_idx\` ON \`orders_line_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_line_items_parent_id_idx\` ON \`orders_line_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`role\` text,
  	\`payment_status\` text DEFAULT 'not-required',
  	\`products\` text NOT NULL,
  	\`checkout_id\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`total_amount\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`payments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`payment_id\` text NOT NULL,
  	\`user_name\` text NOT NULL,
  	\`products\` text,
  	\`details\` text,
  	\`amount\` numeric NOT NULL,
  	\`currency\` text,
  	\`type\` text,
  	\`status\` text NOT NULL,
  	\`mode\` text,
  	\`order_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`payments_order_idx\` ON \`payments\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`payments_updated_at_idx\` ON \`payments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payments_created_at_idx\` ON \`payments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`bookings_anglers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`user_id\` numeric,
  	\`full_name\` text,
  	\`first_name\` text,
  	\`last_name\` text,
  	\`email\` text,
  	\`role\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_anglers_order_idx\` ON \`bookings_anglers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`bookings_anglers_parent_id_idx\` ON \`bookings_anglers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`bookings_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_line_items_order_idx\` ON \`bookings_line_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`bookings_line_items_parent_id_idx\` ON \`bookings_line_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_type\` text DEFAULT 'booking' NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`role\` text,
  	\`email\` text NOT NULL,
  	\`location_id\` integer NOT NULL,
  	\`date\` text,
  	\`total_amount\` numeric DEFAULT 0,
  	\`accept_terms\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_location_idx\` ON \`bookings\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`booking_history\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`location_id\` numeric NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`members\` numeric,
  	\`non_members\` numeric,
  	\`corporate_guests\` numeric,
  	\`date\` text NOT NULL,
  	\`rods_booked\` numeric NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`booking_history_updated_at_idx\` ON \`booking_history\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`booking_history_created_at_idx\` ON \`booking_history\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`catch_returns_returns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`species\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`length\` numeric NOT NULL,
  	\`released\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`catch_returns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`catch_returns_returns_order_idx\` ON \`catch_returns_returns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_returns_parent_id_idx\` ON \`catch_returns_returns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`catch_returns\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`booking_id\` integer,
  	\`nil_return\` integer DEFAULT false,
  	\`stats_total\` numeric DEFAULT 0 NOT NULL,
  	\`stats_average_length\` numeric DEFAULT 0 NOT NULL,
  	\`stats_large_fish\` numeric DEFAULT 0 NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`catch_returns_booking_idx\` ON \`catch_returns\` (\`booking_id\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_updated_at_idx\` ON \`catch_returns\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_created_at_idx\` ON \`catch_returns\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`new_memberships_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`new_memberships\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`new_memberships_line_items_order_idx\` ON \`new_memberships_line_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`new_memberships_line_items_parent_id_idx\` ON \`new_memberships_line_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`new_memberships\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_type\` text DEFAULT 'newMembership' NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`membership_type\` text NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`id_number\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`mobile_number\` text NOT NULL,
  	\`street\` text NOT NULL,
  	\`city\` text NOT NULL,
  	\`province\` text NOT NULL,
  	\`postal_code\` text NOT NULL,
  	\`country\` text NOT NULL,
  	\`other_memberships\` text,
  	\`how_did_you_hear_about_us\` text,
  	\`total_amount\` numeric DEFAULT 0,
  	\`accept_terms\` integer DEFAULT false,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`new_memberships_updated_at_idx\` ON \`new_memberships\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`festivals_give_away_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`festivals_give_away_type_order_idx\` ON \`festivals_give_away_type\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`festivals_give_away_type_parent_idx\` ON \`festivals_give_away_type\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`festivals_garment_sizes\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`festivals_garment_sizes_order_idx\` ON \`festivals_garment_sizes\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`festivals_garment_sizes_parent_idx\` ON \`festivals_garment_sizes\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`festivals_hat_sizes\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`festivals_hat_sizes_order_idx\` ON \`festivals_hat_sizes\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`festivals_hat_sizes_parent_idx\` ON \`festivals_hat_sizes\` (\`parent_id\`);`)
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
  await db.run(sql`CREATE INDEX \`festivals_team_members_order_idx\` ON \`festivals_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`festivals_team_members_parent_id_idx\` ON \`festivals_team_members\` (\`_parent_id\`);`)
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
  await db.run(sql`CREATE INDEX \`festivals_line_items_order_idx\` ON \`festivals_line_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`festivals_line_items_parent_id_idx\` ON \`festivals_line_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`festivals\` (
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
  await db.run(sql`CREATE INDEX \`festivals_updated_at_idx\` ON \`festivals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`festivals_created_at_idx\` ON \`festivals\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_btns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_show\` text DEFAULT 'always',
  	\`link_internal_link\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_btns_links_order_idx\` ON \`pages_blocks_hero_btns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_btns_links_parent_id_idx\` ON \`pages_blocks_hero_btns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_image_idx\` ON \`pages_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_auth\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_auth_order_idx\` ON \`pages_blocks_auth\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_auth_parent_id_idx\` ON \`pages_blocks_auth\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_auth_path_idx\` ON \`pages_blocks_auth\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_auth_image_idx\` ON \`pages_blocks_auth\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_map_default\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Map all locations',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_default_order_idx\` ON \`pages_blocks_map_default\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_default_parent_id_idx\` ON \`pages_blocks_map_default\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_default_path_idx\` ON \`pages_blocks_map_default\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`map\` text DEFAULT '[]',
  	\`specific_directions\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_order_idx\` ON \`pages_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_parent_id_idx\` ON \`pages_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_path_idx\` ON \`pages_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rod_fees_membership\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_order_idx\` ON \`pages_blocks_rod_fees_membership\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_parent_id_idx\` ON \`pages_blocks_rod_fees_membership\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_path_idx\` ON \`pages_blocks_rod_fees_membership\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_booking\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_order_idx\` ON \`pages_blocks_booking\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_parent_id_idx\` ON \`pages_blocks_booking\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_path_idx\` ON \`pages_blocks_booking\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_image_idx\` ON \`pages_blocks_booking\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_locations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'All locations',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_locations_order_idx\` ON \`pages_blocks_locations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_locations_parent_id_idx\` ON \`pages_blocks_locations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_locations_path_idx\` ON \`pages_blocks_locations\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_order\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Order',
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_order_order_idx\` ON \`pages_blocks_order\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_order_parent_id_idx\` ON \`pages_blocks_order\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_order_path_idx\` ON \`pages_blocks_order\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_order_image_idx\` ON \`pages_blocks_order\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_my_bookings\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'My Bookings',
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_bookings_order_idx\` ON \`pages_blocks_my_bookings\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_bookings_parent_id_idx\` ON \`pages_blocks_my_bookings\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_bookings_path_idx\` ON \`pages_blocks_my_bookings\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_bookings_image_idx\` ON \`pages_blocks_my_bookings\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_catch_returns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Catch Returns',
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_catch_returns_order_idx\` ON \`pages_blocks_catch_returns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_catch_returns_parent_id_idx\` ON \`pages_blocks_catch_returns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_catch_returns_path_idx\` ON \`pages_blocks_catch_returns\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_catch_returns_image_idx\` ON \`pages_blocks_catch_returns\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_payments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Payments',
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_payments_order_idx\` ON \`pages_blocks_payments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_payments_parent_id_idx\` ON \`pages_blocks_payments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_payments_path_idx\` ON \`pages_blocks_payments\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_payments_image_idx\` ON \`pages_blocks_payments\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`published_at\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_btns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_show\` text DEFAULT 'always',
  	\`link_internal_link\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_btns_links_order_idx\` ON \`_pages_v_blocks_hero_btns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_btns_links_parent_id_idx\` ON \`_pages_v_blocks_hero_btns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_image_idx\` ON \`_pages_v_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_auth\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_auth_order_idx\` ON \`_pages_v_blocks_auth\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_auth_parent_id_idx\` ON \`_pages_v_blocks_auth\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_auth_path_idx\` ON \`_pages_v_blocks_auth\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_auth_image_idx\` ON \`_pages_v_blocks_auth\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_map_default\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Map all locations',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_default_order_idx\` ON \`_pages_v_blocks_map_default\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_default_parent_id_idx\` ON \`_pages_v_blocks_map_default\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_default_path_idx\` ON \`_pages_v_blocks_map_default\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`map\` text DEFAULT '[]',
  	\`specific_directions\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_order_idx\` ON \`_pages_v_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_parent_id_idx\` ON \`_pages_v_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_path_idx\` ON \`_pages_v_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rod_fees_membership\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_order_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_parent_id_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_path_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_order_idx\` ON \`_pages_v_blocks_booking\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_parent_id_idx\` ON \`_pages_v_blocks_booking\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_path_idx\` ON \`_pages_v_blocks_booking\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_image_idx\` ON \`_pages_v_blocks_booking\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_locations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'All locations',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_locations_order_idx\` ON \`_pages_v_blocks_locations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_locations_parent_id_idx\` ON \`_pages_v_blocks_locations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_locations_path_idx\` ON \`_pages_v_blocks_locations\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_order\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Order',
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_order_order_idx\` ON \`_pages_v_blocks_order\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_order_parent_id_idx\` ON \`_pages_v_blocks_order\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_order_path_idx\` ON \`_pages_v_blocks_order\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_order_image_idx\` ON \`_pages_v_blocks_order\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_my_bookings\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'My Bookings',
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_bookings_order_idx\` ON \`_pages_v_blocks_my_bookings\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_bookings_parent_id_idx\` ON \`_pages_v_blocks_my_bookings\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_bookings_path_idx\` ON \`_pages_v_blocks_my_bookings\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_bookings_image_idx\` ON \`_pages_v_blocks_my_bookings\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_catch_returns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Catch Returns',
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_catch_returns_order_idx\` ON \`_pages_v_blocks_catch_returns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_catch_returns_parent_id_idx\` ON \`_pages_v_blocks_catch_returns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_catch_returns_path_idx\` ON \`_pages_v_blocks_catch_returns\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_catch_returns_image_idx\` ON \`_pages_v_blocks_catch_returns\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_payments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Payments',
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_payments_order_idx\` ON \`_pages_v_blocks_payments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_payments_parent_id_idx\` ON \`_pages_v_blocks_payments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_payments_path_idx\` ON \`_pages_v_blocks_payments\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_payments_image_idx\` ON \`_pages_v_blocks_payments\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_published_at\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`locations_topic\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_topic_order_idx\` ON \`locations_topic\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`locations_topic_parent_idx\` ON \`locations_topic\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_blocks_location_hero_btns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_show\` text DEFAULT 'always',
  	\`link_internal_link\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations_blocks_location_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_hero_btns_links_order_idx\` ON \`locations_blocks_location_hero_btns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_hero_btns_links_parent_id_idx\` ON \`locations_blocks_location_hero_btns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_blocks_location_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_hero_order_idx\` ON \`locations_blocks_location_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_hero_parent_id_idx\` ON \`locations_blocks_location_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_hero_path_idx\` ON \`locations_blocks_location_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_hero_image_idx\` ON \`locations_blocks_location_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_blocks_location_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`description\` text,
  	\`rod_limit\` numeric DEFAULT 2,
  	\`members_only\` integer DEFAULT true,
  	\`bag_limit\` text DEFAULT '2 X 450g',
  	\`has_boats\` integer DEFAULT false,
  	\`has_bass\` integer DEFAULT true,
  	\`fishing_methods\` text,
  	\`requires_key\` integer DEFAULT false,
  	\`requires_gate_code\` integer DEFAULT false,
  	\`access_instructions\` text,
  	\`send_landowner_email\` integer DEFAULT false,
  	\`landowner_email\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_details_order_idx\` ON \`locations_blocks_location_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_details_parent_id_idx\` ON \`locations_blocks_location_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_location_details_path_idx\` ON \`locations_blocks_location_details\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`locations_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`map\` text DEFAULT '[]',
  	\`specific_directions\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_blocks_map_order_idx\` ON \`locations_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_map_parent_id_idx\` ON \`locations_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_blocks_map_path_idx\` ON \`locations_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`locations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`type\` text,
  	\`enabled\` integer DEFAULT false,
  	\`temporarily_closed\` integer DEFAULT false,
  	\`closure_reason\` text,
  	\`closure_from_date\` text,
  	\`closure_to_date\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`published_at\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_meta_meta_image_idx\` ON \`locations\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_slug_idx\` ON \`locations\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`locations__status_idx\` ON \`locations\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_locations_v_version_topic\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_locations_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_locations_v_version_topic_order_idx\` ON \`_locations_v_version_topic\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_topic_parent_idx\` ON \`_locations_v_version_topic\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_locations_v_blocks_location_hero_btns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_show\` text DEFAULT 'always',
  	\`link_internal_link\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_locations_v_blocks_location_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_hero_btns_links_order_idx\` ON \`_locations_v_blocks_location_hero_btns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_hero_btns_links_parent_id_idx\` ON \`_locations_v_blocks_location_hero_btns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_locations_v_blocks_location_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_locations_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_hero_order_idx\` ON \`_locations_v_blocks_location_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_hero_parent_id_idx\` ON \`_locations_v_blocks_location_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_hero_path_idx\` ON \`_locations_v_blocks_location_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_hero_image_idx\` ON \`_locations_v_blocks_location_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_locations_v_blocks_location_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`description\` text,
  	\`rod_limit\` numeric DEFAULT 2,
  	\`members_only\` integer DEFAULT true,
  	\`bag_limit\` text DEFAULT '2 X 450g',
  	\`has_boats\` integer DEFAULT false,
  	\`has_bass\` integer DEFAULT true,
  	\`fishing_methods\` text,
  	\`requires_key\` integer DEFAULT false,
  	\`requires_gate_code\` integer DEFAULT false,
  	\`access_instructions\` text,
  	\`send_landowner_email\` integer DEFAULT false,
  	\`landowner_email\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_locations_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_details_order_idx\` ON \`_locations_v_blocks_location_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_details_parent_id_idx\` ON \`_locations_v_blocks_location_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_location_details_path_idx\` ON \`_locations_v_blocks_location_details\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_locations_v_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`map\` text DEFAULT '[]',
  	\`specific_directions\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_locations_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_map_order_idx\` ON \`_locations_v_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_map_parent_id_idx\` ON \`_locations_v_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_blocks_map_path_idx\` ON \`_locations_v_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_locations_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_type\` text,
  	\`version_enabled\` integer DEFAULT false,
  	\`version_temporarily_closed\` integer DEFAULT false,
  	\`version_closure_reason\` text,
  	\`version_closure_from_date\` text,
  	\`version_closure_to_date\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_published_at\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_locations_v_parent_idx\` ON \`_locations_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_meta_version_meta_image_idx\` ON \`_locations_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_slug_idx\` ON \`_locations_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_updated_at_idx\` ON \`_locations_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version_created_at_idx\` ON \`_locations_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_version_version__status_idx\` ON \`_locations_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_created_at_idx\` ON \`_locations_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_updated_at_idx\` ON \`_locations_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_latest_idx\` ON \`_locations_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_locations_v_autosave_idx\` ON \`_locations_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`mobile_number\` text NOT NULL,
  	\`id_number\` text,
  	\`street\` text,
  	\`city\` text,
  	\`province\` text,
  	\`postal_code\` text,
  	\`country\` text,
  	\`role\` text,
  	\`membership_type\` text,
  	\`blocked\` integer DEFAULT false,
  	\`subs_due\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`email_subscribers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`subscribed\` integer DEFAULT false NOT NULL,
  	\`unsubscribe_token\` text NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`email_subscribers_updated_at_idx\` ON \`email_subscribers\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	\`media_id\` integer,
  	\`orders_id\` integer,
  	\`payments_id\` integer,
  	\`bookings_id\` integer,
  	\`booking_history_id\` integer,
  	\`catch_returns_id\` integer,
  	\`new_memberships_id\` integer,
  	\`festivals_id\` integer,
  	\`pages_id\` integer,
  	\`locations_id\` integer,
  	\`users_id\` integer,
  	\`email_subscribers_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payments_id\`) REFERENCES \`payments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`booking_history_id\`) REFERENCES \`booking_history\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`catch_returns_id\`) REFERENCES \`catch_returns\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`new_memberships_id\`) REFERENCES \`new_memberships\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`festivals_id\`) REFERENCES \`festivals\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`email_subscribers_id\`) REFERENCES \`email_subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_admins_id_idx\` ON \`payload_locked_documents_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`payments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_booking_history_id_idx\` ON \`payload_locked_documents_rels\` (\`booking_history_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_catch_returns_id_idx\` ON \`payload_locked_documents_rels\` (\`catch_returns_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_new_memberships_id_idx\` ON \`payload_locked_documents_rels\` (\`new_memberships_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_festivals_id_idx\` ON \`payload_locked_documents_rels\` (\`festivals_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`email_subscribers_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_admins_id_idx\` ON \`payload_preferences_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`call_to_action_link_type\` text DEFAULT 'reference',
  	\`call_to_action_link_new_tab\` integer,
  	\`call_to_action_link_show\` text DEFAULT 'always',
  	\`call_to_action_link_internal_link\` text,
  	\`call_to_action_link_url\` text,
  	\`call_to_action_link_label\` text,
  	\`rivers_closed_close_date\` text NOT NULL,
  	\`rivers_closed_open_date\` text NOT NULL,
  	\`dams_closed_close_date\` text NOT NULL,
  	\`dams_closed_open_date\` text NOT NULL,
  	\`booking_rules_allowed_future_booking_days\` numeric DEFAULT 14 NOT NULL,
  	\`booking_rules_same_location_booking_in_week\` numeric DEFAULT 1 NOT NULL,
  	\`booking_rules_same_location_booking_in_month\` numeric DEFAULT 2 NOT NULL,
  	\`booking_rules_same_location_booking_consecutive_days\` integer DEFAULT true NOT NULL,
  	\`subs_settings_joining_fee\` numeric NOT NULL,
  	\`subs_settings_om\` numeric NOT NULL,
  	\`subs_settings_omw\` numeric NOT NULL,
  	\`subs_settings_f\` numeric NOT NULL,
  	\`subs_settings_j\` numeric NOT NULL,
  	\`subs_settings_s\` numeric NOT NULL,
  	\`subs_settings_c\` numeric NOT NULL,
  	\`fishing_fees_non_member\` numeric NOT NULL,
  	\`fishing_fees_member_guest\` numeric NOT NULL,
  	\`email_settings_from_email\` text NOT NULL,
  	\`email_settings_from_name\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`navigation\` text DEFAULT '[{"title":"The Club","children":[{"title":"History","link":"the-club/history"},{"title":"Rod Fees & Membership","link":"the-club/rod-fees-membership"},{"title":"Club Rules & Bylaws","link":"the-club/club-rules-bylaws"}]},{"title":"Our Water","children":[{"title":"Stillwaters","link":"our-water/stillwaters"},{"title":"Rivers","link":"our-water/rivers"}]},{"title":"News & Events","children":[{"title":"Festivals","children":[{"title":"Rivers in May Festival","link":"news-and-events/festivals/rivers-in-may-festival"},{"title":"Stillwater Festival","link":"news-and-events/festivals/stillwater-festival"}]},{"title":"News","link":"news-and-events/news"}]},{"title":"Profile","children":[{"title":"Settings","link":"profile/settings"},{"title":"Bookings","link":"profile/bookings"},{"title":"Catch Returns","link":"profile/catch-returns"},{"title":"Payment History","link":"profile/payment-history"},{"title":"Logout","link":"profile/logout"}]}]',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`admins_sessions\`;`)
  await db.run(sql`DROP TABLE \`admins\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`orders_line_items\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`payments\`;`)
  await db.run(sql`DROP TABLE \`bookings_anglers\`;`)
  await db.run(sql`DROP TABLE \`bookings_line_items\`;`)
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`DROP TABLE \`booking_history\`;`)
  await db.run(sql`DROP TABLE \`catch_returns_returns\`;`)
  await db.run(sql`DROP TABLE \`catch_returns\`;`)
  await db.run(sql`DROP TABLE \`new_memberships_line_items\`;`)
  await db.run(sql`DROP TABLE \`new_memberships\`;`)
  await db.run(sql`DROP TABLE \`festivals_give_away_type\`;`)
  await db.run(sql`DROP TABLE \`festivals_garment_sizes\`;`)
  await db.run(sql`DROP TABLE \`festivals_hat_sizes\`;`)
  await db.run(sql`DROP TABLE \`festivals_team_members\`;`)
  await db.run(sql`DROP TABLE \`festivals_line_items\`;`)
  await db.run(sql`DROP TABLE \`festivals\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_btns_links\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_auth\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map_default\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rod_fees_membership\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_locations\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_order\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_my_bookings\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_catch_returns\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_payments\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_btns_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_auth\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_map_default\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rod_fees_membership\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_locations\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_order\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_my_bookings\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_catch_returns\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_payments\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`locations_topic\`;`)
  await db.run(sql`DROP TABLE \`locations_blocks_location_hero_btns_links\`;`)
  await db.run(sql`DROP TABLE \`locations_blocks_location_hero\`;`)
  await db.run(sql`DROP TABLE \`locations_blocks_location_details\`;`)
  await db.run(sql`DROP TABLE \`locations_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`locations\`;`)
  await db.run(sql`DROP TABLE \`_locations_v_version_topic\`;`)
  await db.run(sql`DROP TABLE \`_locations_v_blocks_location_hero_btns_links\`;`)
  await db.run(sql`DROP TABLE \`_locations_v_blocks_location_hero\`;`)
  await db.run(sql`DROP TABLE \`_locations_v_blocks_location_details\`;`)
  await db.run(sql`DROP TABLE \`_locations_v_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`_locations_v\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`email_subscribers\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
}
