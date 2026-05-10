import * as migration_20260501_080655 from './20260501_080655';
import * as migration_20260502_062500 from './20260502_062500';
import * as migration_20260503_133320 from './20260503_133320';
import * as migration_20260510_094405_add_payload_jobs_tables from './20260510_094405_add_payload_jobs_tables';

export const migrations = [
  {
    up: migration_20260501_080655.up,
    down: migration_20260501_080655.down,
    name: '20260501_080655',
  },
  {
    up: migration_20260502_062500.up,
    down: migration_20260502_062500.down,
    name: '20260502_062500',
  },
  {
    up: migration_20260503_133320.up,
    down: migration_20260503_133320.down,
    name: '20260503_133320',
  },
  {
    up: migration_20260510_094405_add_payload_jobs_tables.up,
    down: migration_20260510_094405_add_payload_jobs_tables.down,
    name: '20260510_094405_add_payload_jobs_tables'
  },
];
