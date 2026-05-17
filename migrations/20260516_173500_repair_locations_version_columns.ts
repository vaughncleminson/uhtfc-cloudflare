import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

type TableInfoRow = {
  name: string
}

async function getColumnNames(db: MigrateUpArgs['db'] | MigrateDownArgs['db'], tableName: string) {
  const result = await db.run(sql.raw(`PRAGMA table_info('${tableName}');`)).execute()

  return new Set(((result.rows ?? []) as TableInfoRow[]).map((row) => row.name))
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const versionColumns = await getColumnNames(db, '_locations_v')

  if (!versionColumns.has('version_contact_person')) {
    await db.run(sql`ALTER TABLE \
      \`_locations_v\` ADD \`version_contact_person\` text;`)
  }

  if (!versionColumns.has('version_contact_person_email')) {
    await db.run(sql`ALTER TABLE \
      \`_locations_v\` ADD \`version_contact_person_email\` text;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const versionColumns = await getColumnNames(db, '_locations_v')

  if (versionColumns.has('version_contact_person_email')) {
    await db.run(sql`ALTER TABLE \
      \`_locations_v\` DROP COLUMN \`version_contact_person_email\`;`)
  }

  if (versionColumns.has('version_contact_person')) {
    await db.run(sql`ALTER TABLE \
      \`_locations_v\` DROP COLUMN \`version_contact_person\`;`)
  }
}
