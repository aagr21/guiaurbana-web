export interface TrafficLight {
  id: number;
  geom: Geom;
  location: string;
}

export interface Geom {
  type: string;
  coordinates: number[];
}
