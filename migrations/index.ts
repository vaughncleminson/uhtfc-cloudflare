import * as migration_20260501_080655 from './20260501_080655';
import * as migration_20260502_062500 from './20260502_062500';
import * as migration_20260503_133320 from './20260503_133320';
import * as migration_20260516_153311 from './20260516_153311';
import * as migration_20260606_152854 from './20260606_152854';
import * as migration_20260606_190257 from './20260606_190257';

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
    up: migration_20260516_153311.up,
    down: migration_20260516_153311.down,
    name: '20260516_153311',
  },
  {
    up: migration_20260606_152854.up,
    down: migration_20260606_152854.down,
    name: '20260606_152854',
  },
  {
    up: migration_20260606_190257.up,
    down: migration_20260606_190257.down,
    name: '20260606_190257'
  },
];
