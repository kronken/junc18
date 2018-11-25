import * as Knex from 'knex';

export const createFunctions = async (knex: Knex) => {
  return await knex.raw(`
        DROP TYPE IF EXISTS grid CASCADE;
        create type grid as (
            grid_id integer,
            lat numeric(9,6),
            lon numeric(9,6),
            point geometry
        );
        create or replace function grid_ids_by_bbox(
            min_lat double precision,
            min_lon double precision,
            max_lat double precision,
            max_lon double precision
        ) returns setof grid as $$
            select
                m.id as grid_id,
                ST_Y(ST_Centroid(m.geom))::numeric as lon,
                ST_X(ST_Centroid(m.geom))::numeric as lat,
                ST_Centroid(m.geom) as point
            from
                activity_mapping as m
            where
                ST_Contains(ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326), m.geom) or
                ST_Overlaps(ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326), m.geom)
            group by id;
        $$ language sql stable;
    `);
};
