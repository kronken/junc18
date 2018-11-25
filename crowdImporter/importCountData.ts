import * as Knex from 'knex';
import * as csvParse from 'csv-parse';

import * as moment from 'moment';
import * as fs from 'fs';
import { join } from 'path';

interface Row {
  grid_id: number;
  time: moment.Moment;
  count: number;
}

export const importCountData = async (
  knex: Knex,
  tableName: string,
  dataPath: string,
  dataFileName: string,
) => {
  const rowCount = Number((await knex(tableName).count('id'))[0].count);

  if (!rowCount) {
    console.log(`Importing count data into ${tableName}...`);

    const csvParser = csvParse({
      delimiter: ',',
    });

    const csvStream = fs.createReadStream(join(dataPath, dataFileName));

    let batchedData: Row[] = [];
    let inserted = 0;
    const batchSize = 20000;

    const insertBatchedData = async () => {
      await knex.batchInsert(tableName, batchedData, batchSize);
    };

    return new Promise(resolve => {
      csvStream
        .pipe(csvParser)
        .on('data', async (csvData: string[]) => {
          // csvData: [gridId, timestamp, count]
          const gridId = Number(csvData[0]);
          const timestamp = moment(csvData[1], 'DD.MM.YYYY HH:mm:ss');
          const count = Number(csvData[2]);

          // skips first line which is just headings
          if (isNaN(count)) return console.warn(`skipping invalid count ${count}`);

          batchedData.push({
            grid_id: gridId,
            time: timestamp,
            count,
          });

          if (batchedData.length === batchSize) {
            csvStream.pause();
            inserted += batchSize;
            await insertBatchedData();
            console.log('inserted up to', inserted);
            batchedData = [];
            csvStream.resume();
          }
        })
        .on('end', async () => {
          await insertBatchedData();
          resolve();
        });
    });
  } else {
    console.log(`Skipped importing count data as ${tableName} is not empty`);
  }
};
