import * as migration_20260501_080655 from './20260501_080655'
import * as migration_20260502_062500 from './20260502_062500'

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
]
