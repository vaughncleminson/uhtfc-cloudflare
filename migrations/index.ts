import * as migration_20260430_143351 from './20260430_143351'
import * as migration_20260430_143352 from './20260430_143352'
import * as migration_20260430_143353 from './20260430_143353'

export const migrations = [
  {
    up: migration_20260430_143351.up,
    down: migration_20260430_143351.down,
    name: '20260430_143351',
  },
  {
    up: migration_20260430_143352.up,
    down: migration_20260430_143352.down,
    name: '20260430_143352',
  },
  {
    up: migration_20260430_143353.up,
    down: migration_20260430_143353.down,
    name: '20260430_143353',
  },
]
