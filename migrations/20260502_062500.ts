import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(
      sql`ALTER TABLE \`booking_history\` RENAME COLUMN \`corporate_guests\` TO \`member_guests\`;`,
    )
  } catch (error) {
    // Ignore if the legacy column does not exist.
    if (
      !(error instanceof Error) ||
      !error.message.includes('no such column: "corporate_guests"')
    ) {
      throw error
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try {
    await db.run(
      sql`ALTER TABLE \`booking_history\` RENAME COLUMN \`member_guests\` TO \`corporate_guests\`;`,
    )
  } catch (error) {
    // Ignore if the current column does not exist.
    if (!(error instanceof Error) || !error.message.includes('no such column: "member_guests"')) {
      throw error
    }
  }
}
