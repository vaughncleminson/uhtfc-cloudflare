import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`email_subscribers\` ADD \`sent\` integer;`)
  await db.run(sql`ALTER TABLE \`email_subscribers\` ADD \`sent_date\` text;`)
  await db.run(sql`ALTER TABLE \`email_subscribers\` ADD \`failed\` integer;`)
  await db.run(sql`ALTER TABLE \`email_subscribers\` ADD \`failed_reason\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`email_subscribers\` DROP COLUMN \`sent\`;`)
  await db.run(sql`ALTER TABLE \`email_subscribers\` DROP COLUMN \`sent_date\`;`)
  await db.run(sql`ALTER TABLE \`email_subscribers\` DROP COLUMN \`failed\`;`)
  await db.run(sql`ALTER TABLE \`email_subscribers\` DROP COLUMN \`failed_reason\`;`)
}
