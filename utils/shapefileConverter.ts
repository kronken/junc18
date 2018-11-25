import * as shapefile from 'shapefile';

type Coordinate = [number, number];
type Shape = Coordinate[];
type Shapes = Shape[];

export interface IShape {
  type: 'Feature';
  properties: {
    ID?: number;
    col_id: number;
    row_id: number;
    maakunta: string;
    nimi: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: Shapes;
  };
}

export const converter = async (sourceFile: string): Promise<IShape[]> => {
  const source = await shapefile.open(sourceFile);
  const arr = [];

  while (true) {
    const res = await source.read();

    if (res.done) {
      break;
    }
    arr.push(res.value);
  }

  return arr as any;
};
