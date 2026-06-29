import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`physical_address\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`street\`;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`city\`;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`province\`;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`postal_code\`;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`country\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rod_fees_membership\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_image_idx\` ON \`pages_blocks_rod_fees_membership\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rod_fees_membership\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_image_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_rod_fees_membership\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_rod_fees_membership\`("_order", "_parent_id", "_path", "id", "block_name") SELECT "_order", "_parent_id", "_path", "id", "block_name" FROM \`pages_blocks_rod_fees_membership\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rod_fees_membership\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_rod_fees_membership\` RENAME TO \`pages_blocks_rod_fees_membership\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_order_idx\` ON \`pages_blocks_rod_fees_membership\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_parent_id_idx\` ON \`pages_blocks_rod_fees_membership\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rod_fees_membership_path_idx\` ON \`pages_blocks_rod_fees_membership\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_rod_fees_membership\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_rod_fees_membership\`("_order", "_parent_id", "_path", "id", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "_uuid", "block_name" FROM \`_pages_v_blocks_rod_fees_membership\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rod_fees_membership\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_rod_fees_membership\` RENAME TO \`_pages_v_blocks_rod_fees_membership\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_order_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_parent_id_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rod_fees_membership_path_idx\` ON \`_pages_v_blocks_rod_fees_membership\` (\`_path\`);`)
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`street\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`city\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`province\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`postal_code\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`country\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`physical_address\`;`)
}
