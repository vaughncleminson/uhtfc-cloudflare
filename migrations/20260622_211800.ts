import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`catch_returns\` ADD \`return_completed\` integer DEFAULT false NOT NULL;`,
  )
  await db.run(sql`ALTER TABLE \`catch_returns\` ADD \`public_id\` text;`)
  await db.run(
    sql`UPDATE \`catch_returns\` SET \`public_id\` = 'legacy-' || \`id\` WHERE \`public_id\` IS NULL OR \`public_id\` = '';`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`catch_returns_public_id_idx\` ON \`catch_returns\` (\`public_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`catch_returns_public_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` DROP COLUMN \`return_completed\`;`)
  await db.run(sql`ALTER TABLE \`catch_returns\` DROP COLUMN \`public_id\`;`)
}
