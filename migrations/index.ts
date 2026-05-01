import * as migration_20260501_080655 from './20260501_080655';

export const migrations = [
  {
    up: migration_20260501_080655.up,
    down: migration_20260501_080655.down,
    name: '20260501_080655'
  },
];
