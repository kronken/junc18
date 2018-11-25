import * as Knex from 'knex';
import { converter } from '../utils/shapefileConverter';
import { join } from 'path';

export const importMappingData = async (
  knex: Knex,
  tableName: string,
  dataPath: string,
  shapeFileName: string,
) => {
  const rowCount = Number((await knex(tableName).count('id'))[0].count);

  if (!rowCount) {
    console.log(`Importing shapefile data into ${tableName}...`);
    const shapeData = await converter(join(dataPath, shapeFileName));

    await knex.batchInsert(
      tableName,
      shapeData
        .filter(row => row.properties.ID)
        .map(row => ({
          id: row.properties.ID,
          geom: knex.raw(`ST_GeomFromGeoJSON('{
            "type":"Polygon",
            "coordinates": ${JSON.stringify(row.geometry.coordinates)},
            "crs":{"type":"name","properties":{"name":"EPSG:4326"}}
          }')`),
        })),
    );
  } else {
    console.log(`Skipped importing mapping data as ${tableName} is not empty`);
  }
};
