import * as migration_20260501_080655 from './20260501_080655';
import * as migration_20260502_062500 from './20260502_062500';
import * as migration_20260503_133320 from './20260503_133320';
import * as migration_20260516_153311 from './20260516_153311';
import * as migration_20260606_152854 from './20260606_152854';
import * as migration_20260606_190257 from './20260606_190257';
import * as migration_20260606_202520 from './20260606_202520';
import * as migration_20260606_210855 from './20260606_210855';
import * as migration_20260606_212221 from './20260606_212221';
import * as migration_20260606_214243 from './20260606_214243';
import * as migration_20260607_070747 from './20260607_070747';
import * as migration_20260610_124048 from './20260610_124048';
import * as migration_20260610_192304 from './20260610_192304';

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
    name: '20260606_190257',
  },
  {
    up: migration_20260606_202520.up,
    down: migration_20260606_202520.down,
    name: '20260606_202520',
  },
  {
    up: migration_20260606_210855.up,
    down: migration_20260606_210855.down,
    name: '20260606_210855',
  },
  {
    up: migration_20260606_212221.up,
    down: migration_20260606_212221.down,
    name: '20260606_212221',
  },
  {
    up: migration_20260606_214243.up,
    down: migration_20260606_214243.down,
    name: '20260606_214243',
  },
  {
    up: migration_20260607_070747.up,
    down: migration_20260607_070747.down,
    name: '20260607_070747',
  },
  {
    up: migration_20260610_124048.up,
    down: migration_20260610_124048.down,
    name: '20260610_124048',
  },
  {
    up: migration_20260610_192304.up,
    down: migration_20260610_192304.down,
    name: '20260610_192304'
  },
];
