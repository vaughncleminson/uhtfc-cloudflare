import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`order_id\` numeric;`)
  await db.run(sql`ALTER TABLE \`booking_history\` ADD \`order_id\` numeric;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` ADD \`order_id\` numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`order_id\`;`)
  await db.run(sql`ALTER TABLE \`booking_history\` DROP COLUMN \`order_id\`;`)
  await db.run(sql`ALTER TABLE \`new_memberships\` DROP COLUMN \`order_id\`;`)
}
