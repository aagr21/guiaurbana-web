export interface Parking {
  id?: number;
  geom: Geom;
  isFull?: boolean;
  startAttention?: string;
  endAttention?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Geom {
  type?: string;
  coordinates?: number[];
}
