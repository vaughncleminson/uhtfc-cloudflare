import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`email_audit_logs_to\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_audit_logs_to_order_idx\` ON \`email_audit_logs_to\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_audit_logs_to_parent_id_idx\` ON \`email_audit_logs_to\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_audit_logs_cc\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_audit_logs_cc_order_idx\` ON \`email_audit_logs_cc\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_audit_logs_cc_parent_id_idx\` ON \`email_audit_logs_cc\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_audit_logs_bcc\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`email_audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`email_audit_logs_bcc_order_idx\` ON \`email_audit_logs_bcc\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`email_audit_logs_bcc_parent_id_idx\` ON \`email_audit_logs_bcc\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`email_audit_logs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`sent_at\` text NOT NULL,
  	\`status\` text NOT NULL,
  	\`delivery_type\` text NOT NULL,
  	\`provider\` text DEFAULT 'mailersend' NOT NULL,
  	\`subject\` text NOT NULL,
  	\`template_id\` text,
  	\`from_email\` text NOT NULL,
  	\`from_name\` text,
  	\`reply_to_email\` text,
  	\`reply_to_name\` text,
  	\`skip_reason\` text,
  	\`error\` text,
  	\`response\` text,
  	\`meta\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`email_audit_logs_updated_at_idx\` ON \`email_audit_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`email_audit_logs_created_at_idx\` ON \`email_audit_logs\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`email_audit_logs_id\` integer REFERENCES email_audit_logs(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_email_audit_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`email_audit_logs_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`email_audit_logs_to\`;`)
  await db.run(sql`DROP TABLE \`email_audit_logs_cc\`;`)
  await db.run(sql`DROP TABLE \`email_audit_logs_bcc\`;`)
  await db.run(sql`DROP TABLE \`email_audit_logs\`;`)
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
  	\`festival_entries_id\` integer,
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
  	FOREIGN KEY (\`festival_entries_id\`) REFERENCES \`festival_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "admins_id", "bookings_id", "booking_history_id", "catch_returns_id", "email_subscribers_id", "festivals_id", "festival_entries_id", "locations_id", "media_id", "new_memberships_id", "orders_id", "payments_id", "pages_id", "users_id", "previous_users_id") SELECT "id", "order", "parent_id", "path", "admins_id", "bookings_id", "booking_history_id", "catch_returns_id", "email_subscribers_id", "festivals_id", "festival_entries_id", "locations_id", "media_id", "new_memberships_id", "orders_id", "payments_id", "pages_id", "users_id", "previous_users_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_festival_entries_id_idx\` ON \`payload_locked_documents_rels\` (\`festival_entries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_new_memberships_id_idx\` ON \`payload_locked_documents_rels\` (\`new_memberships_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`payments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_previous_users_id_idx\` ON \`payload_locked_documents_rels\` (\`previous_users_id\`);`)
}
