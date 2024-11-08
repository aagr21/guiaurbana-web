export interface SpeedReducer {
    id:       number;
    geom:     Geom;
    location: string;
    year:     string;
}

export interface Geom {
    type:        string;
    coordinates: number[];
}
