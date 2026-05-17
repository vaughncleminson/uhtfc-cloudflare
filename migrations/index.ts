import * as migration_20260501_080655 from './20260501_080655'
import * as migration_20260502_062500 from './20260502_062500'
import * as migration_20260503_133320 from './20260503_133320'
import * as migration_20260516_153311 from './20260516_153311'
import * as migration_20260516_173500_repair_locations_version_columns from './20260516_173500_repair_locations_version_columns'

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
    up: migration_20260516_173500_repair_locations_version_columns.up,
    down: migration_20260516_173500_repair_locations_version_columns.down,
    name: '20260516_173500_repair_locations_version_columns',
  },
]
