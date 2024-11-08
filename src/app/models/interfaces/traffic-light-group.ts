import { TrafficLight } from './traffic-light';

export interface TrafficLightGroup {
  id: number;
  type: string;
  trafficLights: TrafficLight[];
}
