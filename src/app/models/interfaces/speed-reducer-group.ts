import { SpeedReducer } from './speed-reducer';

export interface SpeedReducerGroup {
  id: number;
  year: string;
  speedReducers: SpeedReducer[];
}
