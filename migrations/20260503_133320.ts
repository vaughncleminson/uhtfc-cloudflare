import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`locations\` ADD \`contact_person\` text;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`contact_person_email\` text;`)
  await db.run(sql`ALTER TABLE \`_locations_v\` ADD \`version_contact_person\` text;`)
  await db.run(sql`ALTER TABLE \`_locations_v\` ADD \`version_contact_person_email\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`contact_person\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`contact_person_email\`;`)
  await db.run(sql`ALTER TABLE \`_locations_v\` DROP COLUMN \`version_contact_person\`;`)
  await db.run(sql`ALTER TABLE \`_locations_v\` DROP COLUMN \`version_contact_person_email\`;`)
}
