import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`public_id\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`vehicle_model\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`vehicle_registration\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`vehicle_colour\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`bookings_public_id_idx\` ON \`bookings\` (\`public_id\`);`)
  await db.run(sql`ALTER TABLE \`catch_returns\` ADD \`return_completed\` integer DEFAULT false NOT NULL;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` ADD \`public_id\` text NOT NULL;`)
  await db.run(sql`CREATE UNIQUE INDEX \`catch_returns_public_id_idx\` ON \`catch_returns\` (\`public_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`bookings_public_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`public_id\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`vehicle_model\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`vehicle_registration\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`vehicle_colour\`;`)
  await db.run(sql`DROP INDEX \`catch_returns_public_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` DROP COLUMN \`return_completed\`;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` DROP COLUMN \`public_id\`;`)
}
