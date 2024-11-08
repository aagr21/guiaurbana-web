export interface LineRoute {
  id: number;
  geom: Geom;
  name: string;
  ground: Ground;
  direction: string;
}

export interface Geom {
  type: string;
  coordinates: Array<number[]>;
}

export enum Ground {
  Ida = "IDA",
  Vuelta = "VUELTA",
}
