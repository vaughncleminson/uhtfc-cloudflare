import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`fmd_spray_required\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`booking_rules_require_f_m_d_spray_when_booking\` integer DEFAULT true NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`fmd_spray_required\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`booking_rules_require_f_m_d_spray_when_booking\`;`)
}
