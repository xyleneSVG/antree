import * as migration_20260128_130648 from './20260128_130648';
import * as migration_20260128_150306 from './20260128_150306';
import * as migration_20260128_162413 from './20260128_162413';

export const migrations = [
  {
    up: migration_20260128_130648.up,
    down: migration_20260128_130648.down,
    name: '20260128_130648',
  },
  {
    up: migration_20260128_150306.up,
    down: migration_20260128_150306.down,
    name: '20260128_150306',
  },
  {
    up: migration_20260128_162413.up,
    down: migration_20260128_162413.down,
    name: '20260128_162413'
  },
];
