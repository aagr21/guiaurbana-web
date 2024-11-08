import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AllData, LineName, LineRoute } from '@models/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment.prod';
import { FindLineRoute } from '@models/interfaces/find-line-route';

export interface BusStop {
  stopLat: number;
  stopLon: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private http = inject(HttpClient);

  private _allData = new BehaviorSubject<AllData>(undefined!);

  get allData$() {
    return this._allData.asObservable();
  }

  setAllData(allData: AllData) {
    this._allData.next(allData);
  }

  getAll(): Observable<AllData> {
    return this.http.get<AllData>(`${environment.apiBaseUrl}/api/root`);
  }

  findLineNamesNearStop(busStop: BusStop) {
    return this.http.get<LineName[]>(
      `${environment.apiBaseUrl}/api/lines-names?stop_lat=${busStop.stopLat}&stop_lon=${busStop.stopLon}`
    );
  }

  findLineRoute(findLineRoute: FindLineRoute): Observable<LineRoute> {
    return this.http.post<LineRoute>(
      `${environment.apiBaseUrl}/api/lines-routes/find-line-route`,
      findLineRoute
    );
  }
}
