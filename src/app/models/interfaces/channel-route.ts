export interface ChannelRoute {
    id:        number;
    geom:      Geom;
    name:      string;
    isPrimary: boolean;
    color:     string;
}

export interface Geom {
    type:        string;
    coordinates: Array<number[]>;
}
