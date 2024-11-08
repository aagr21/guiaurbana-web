export interface CityCamera {
  id: number;
  geom: Geom;
  location: string;
}

export interface Geom {
  type: string;
  coordinates: number[];
}
