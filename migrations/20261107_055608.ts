import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_catch_returns\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`booking_id\` integer NOT NULL,
  	\`user_id\` numeric,
  	\`location_name\` text,
  	\`return_completed\` integer DEFAULT false NOT NULL,
  	\`nil_return\` integer DEFAULT false,
  	\`public_id\` text NOT NULL,
  	\`stats_total\` numeric DEFAULT 0 NOT NULL,
  	\`stats_average_length\` numeric DEFAULT 0 NOT NULL,
  	\`stats_large_fish\` numeric DEFAULT 0 NOT NULL,
  	\`comments\` text DEFAULT '',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_catch_returns\`("id", "booking_id", "user_id", "location_name", "return_completed", "nil_return", "public_id", "stats_total", "stats_average_length", "stats_large_fish", "comments", "updated_at", "created_at") SELECT "id", "booking_id", "user_id", "location_name", "return_completed", "nil_return", "public_id", "stats_total", "stats_average_length", "stats_large_fish", "comments", "updated_at", "created_at" FROM \`catch_returns\`;`)
  await db.run(sql`DROP TABLE \`catch_returns\`;`)
  await db.run(sql`ALTER TABLE \`__new_catch_returns\` RENAME TO \`catch_returns\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`catch_returns_booking_idx\` ON \`catch_returns\` (\`booking_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`catch_returns_public_id_idx\` ON \`catch_returns\` (\`public_id\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_updated_at_idx\` ON \`catch_returns\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_created_at_idx\` ON \`catch_returns\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_catch_returns\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`booking_id\` integer,
  	\`user_id\` numeric,
  	\`location_name\` text,
  	\`return_completed\` integer DEFAULT false NOT NULL,
  	\`nil_return\` integer DEFAULT false,
  	\`public_id\` text NOT NULL,
  	\`stats_total\` numeric DEFAULT 0 NOT NULL,
  	\`stats_average_length\` numeric DEFAULT 0 NOT NULL,
  	\`stats_large_fish\` numeric DEFAULT 0 NOT NULL,
  	\`comments\` text DEFAULT '',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_catch_returns\`("id", "booking_id", "user_id", "location_name", "return_completed", "nil_return", "public_id", "stats_total", "stats_average_length", "stats_large_fish", "comments", "updated_at", "created_at") SELECT "id", "booking_id", "user_id", "location_name", "return_completed", "nil_return", "public_id", "stats_total", "stats_average_length", "stats_large_fish", "comments", "updated_at", "created_at" FROM \`catch_returns\`;`)
  await db.run(sql`DROP TABLE \`catch_returns\`;`)
  await db.run(sql`ALTER TABLE \`__new_catch_returns\` RENAME TO \`catch_returns\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`catch_returns_booking_idx\` ON \`catch_returns\` (\`booking_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`catch_returns_public_id_idx\` ON \`catch_returns\` (\`public_id\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_updated_at_idx\` ON \`catch_returns\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`catch_returns_created_at_idx\` ON \`catch_returns\` (\`created_at\`);`)
}
