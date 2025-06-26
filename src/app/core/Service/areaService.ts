import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private apiUrl = 'https://localhost:44369/api';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Area/Area/GetAll`);
  }

  getStates(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Area/State/GetByCountry?countryId=${countryId}`);
  }

  getCities(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Area/GetByState?stateId=${stateId}`);
  }

  getAreas(cityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Area/Area/GetByCity?cityId=${cityId}`);
  }

  saveLocation(locationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Area/Location/Save`, locationData);
  }
}
