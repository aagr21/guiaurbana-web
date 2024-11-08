import { EducationCenter } from './education-center';

export interface EducationCenterGroup {
  id: number;
  type: string;
  educationCenters: EducationCenter[];
}
