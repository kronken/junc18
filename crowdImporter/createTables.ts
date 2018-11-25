import * as Knex from 'knex';

export const createTables = async (knex: Knex) => {
  if (!(await knex.schema.hasTable('activity_mapping'))) {
    await knex.schema.createTable('activity_mapping', table => {
      table.integer('id').primary();
      table.specificType('geom', 'geometry(Polygon,4326)');
    });
  }

  if (!(await knex.schema.hasTable('activity_data'))) {
    await knex.schema.createTable('activity_data', table => {
      table.increments(); // integer id

      table.integer('grid_id').notNullable().references('id').inTable('activity_mapping');
      table.dateTime('time');
      table.integer('count');
    });
  }

  /*
  if (!(await knex.schema.hasTable('footfall_mapping'))) {
    await knex.schema.createTable('footfall_mapping', table => {
      table.integer('id').primary();
      table.specificType('geom', 'geometry(Polygon,4326)');
    });
  }

  if (!(await knex.schema.hasTable('footfall_data'))) {
    await knex.schema.createTable('footfall_data', table => {
      table.increments(); // integer id

      table.integer('grid_id').notNullable().references('id').inTable('footfall_mapping');
      table.integer('count');
      table.timestamp('time')
    });
  }
  */
};
