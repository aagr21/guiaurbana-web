import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Parking } from '@models/interfaces';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ParkingsService extends Socket {

  constructor() {
    super({
      url: `${environment.apiBaseUrl}/parkings`,
    });
    this.onParkingsUpdate();
  }

  onParkingsUpdate() {
    return this.fromEvent<Parking[]>('update');
  }
}
