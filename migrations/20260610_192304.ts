import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`public_id\` text;`)
  await db.run(
    sql`UPDATE \`bookings\` SET \`public_id\` = 'legacy-' || \`id\` WHERE \`public_id\` IS NULL OR \`public_id\` = '';`,
  )
  await db.run(sql`CREATE UNIQUE INDEX \`bookings_public_id_idx\` ON \`bookings\` (\`public_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`bookings_public_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`public_id\`;`)
}
