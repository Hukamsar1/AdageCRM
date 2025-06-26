import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Designation } from '../interface/Ideignation';

@Injectable({ providedIn: 'root' })
export class DesignationService {
  private apiUrl = 'https://your-api-url/designations';

  constructor(private http: HttpClient) {}

  saveDesignation(designation: Designation): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, designation);
  }

  updateDesignation(id: number, designation: Designation): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, designation);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(`${this.apiUrl}/list`);
  }
}
