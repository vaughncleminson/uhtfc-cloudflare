import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_my_catch_returns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'My Catch Returns',
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_catch_returns_order_idx\` ON \`pages_blocks_my_catch_returns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_catch_returns_parent_id_idx\` ON \`pages_blocks_my_catch_returns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_catch_returns_path_idx\` ON \`pages_blocks_my_catch_returns\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_my_catch_returns_image_idx\` ON \`pages_blocks_my_catch_returns\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_my_catch_returns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'My Catch Returns',
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_catch_returns_order_idx\` ON \`_pages_v_blocks_my_catch_returns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_catch_returns_parent_id_idx\` ON \`_pages_v_blocks_my_catch_returns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_catch_returns_path_idx\` ON \`_pages_v_blocks_my_catch_returns\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_my_catch_returns_image_idx\` ON \`_pages_v_blocks_my_catch_returns\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`catch_returns\` ADD \`user_id\` numeric;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` ADD \`location_name\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_my_catch_returns\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_my_catch_returns\`;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` DROP COLUMN \`user_id\`;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` DROP COLUMN \`location_name\`;`)
}
