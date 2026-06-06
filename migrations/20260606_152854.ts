import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {}
