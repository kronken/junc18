import { createTables } from './createTables';
import * as Knex from 'knex';
import * as KnexPostGIS from 'knex-postgis';
import { importMappingData } from './importMappingData';
import { importCountData } from './importCountData';

import { join } from 'path';
import * as minimist from 'minimist';
import { createFunctions } from './createFunction';
const args = minimist(process.argv.slice(2));

const knex = Knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
});

// install postgis functions in knex.postgis;
const st = KnexPostGIS(knex);

const dataPath = args['dataPath'] || join(__dirname, '..', 'data');

const doImport = async () => {
  await createTables(knex);
  await createFunctions(knex);

  // activities
  await importMappingData(
    knex,
    'activity_mapping',
    dataPath,
    'FI_MTC_WGS84_update.shp',
  );

  await importCountData(
    knex,
    'activity_data',
    dataPath,
    'Uusimaa_activity_data_hourly_20_min_break_MTC_201801.txt',
  );

  knex.destroy();
};

doImport();
