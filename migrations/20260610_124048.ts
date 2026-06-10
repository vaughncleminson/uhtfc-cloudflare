import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`payments_line_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	\`price\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payments_line_items_order_idx\` ON \`payments_line_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payments_line_items_parent_id_idx\` ON \`payments_line_items\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`summary\` text,
  	\`total_amount\` numeric NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`order_id\` numeric NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payments\`("id", "date", "first_name", "last_name", "summary", "total_amount", "status", "order_id", "updated_at", "created_at") SELECT "id", "date", "first_name", "last_name", "summary", "total_amount", "status", "order_id", "updated_at", "created_at" FROM \`payments\`;`)
  await db.run(sql`DROP TABLE \`payments\`;`)
  await db.run(sql`ALTER TABLE \`__new_payments\` RENAME TO \`payments\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payments_updated_at_idx\` ON \`payments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payments_created_at_idx\` ON \`payments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_type\` text DEFAULT 'booking' NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`order_id\` numeric,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`role\` text,
  	\`email\` text NOT NULL,
  	\`location_id\` integer,
  	\`location_name\` text,
  	\`date\` text,
  	\`active\` integer DEFAULT false,
  	\`total_amount\` numeric DEFAULT 0,
  	\`accept_terms\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_bookings\`("id", "product_type", "user_id", "order_id", "first_name", "last_name", "role", "email", "location_id", "location_name", "date", "active", "total_amount", "accept_terms", "updated_at", "created_at") SELECT "id", "product_type", "user_id", "order_id", "first_name", "last_name", "role", "email", "location_id", "location_name", "date", "active", "total_amount", "accept_terms", "updated_at", "created_at" FROM \`bookings\`;`)
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`ALTER TABLE \`__new_bookings\` RENAME TO \`bookings\`;`)
  await db.run(sql`CREATE INDEX \`bookings_location_idx\` ON \`bookings\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`booking_history\` ADD \`booking_id\` numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`payments_line_items\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_type\` text DEFAULT 'booking' NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`order_id\` numeric,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`role\` text,
  	\`email\` text NOT NULL,
  	\`location_id\` integer NOT NULL,
  	\`date\` text,
  	\`active\` integer DEFAULT false,
  	\`total_amount\` numeric DEFAULT 0,
  	\`accept_terms\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_bookings\`("id", "product_type", "user_id", "order_id", "first_name", "last_name", "role", "email", "location_id", "date", "active", "total_amount", "accept_terms", "updated_at", "created_at") SELECT "id", "product_type", "user_id", "order_id", "first_name", "last_name", "role", "email", "location_id", "date", "active", "total_amount", "accept_terms", "updated_at", "created_at" FROM \`bookings\`;`)
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`ALTER TABLE \`__new_bookings\` RENAME TO \`bookings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`bookings_location_idx\` ON \`bookings\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payments\` (
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
  await db.run(sql`INSERT INTO \`__new_payments\`("id", "payment_id", "user_name", "products", "details", "amount", "currency", "type", "status", "mode", "order_id", "updated_at", "created_at") SELECT "id", "payment_id", "user_name", "products", "details", "amount", "currency", "type", "status", "mode", "order_id", "updated_at", "created_at" FROM \`payments\`;`)
  await db.run(sql`DROP TABLE \`payments\`;`)
  await db.run(sql`ALTER TABLE \`__new_payments\` RENAME TO \`payments\`;`)
  await db.run(sql`CREATE INDEX \`payments_order_idx\` ON \`payments\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`payments_updated_at_idx\` ON \`payments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payments_created_at_idx\` ON \`payments\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`booking_history\` DROP COLUMN \`booking_id\`;`)
}
