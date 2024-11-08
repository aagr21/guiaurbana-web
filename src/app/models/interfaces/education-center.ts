export interface EducationCenter {
  id: number;
  geom: Geom;
  name: string;
}

export interface Geom {
  type: string;
  coordinates: number[];
}
