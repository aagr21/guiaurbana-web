export interface BusStop {
  id: number;
  geom: Geom;
}

export interface Geom {
  type: string;
  coordinates: number[];
}
