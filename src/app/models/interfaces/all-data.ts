import {
  BusStop,
  ChannelRoute,
  CityCamera,
  EducationCenterGroup,
  LineName,
  Parking,
  SpeedReducer,
  TrafficLightGroup,
} from '@models/interfaces';

export interface AllData {
  busStops: BusStop[];
  cityCameras: CityCamera[];
  linesNames: LineName[];
  channelsRoutes: ChannelRoute[];
  speedReducers: SpeedReducer[];
  trafficLightsGroups: TrafficLightGroup[];
  educationCentersGroups: EducationCenterGroup[];
  parkings: Parking[];
}
