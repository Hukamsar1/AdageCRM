import { Observable } from "rxjs";
import { Designation } from "../interface/Ideignation";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DesignationService {
  private apiUrl = 'https://localhost:44369/api/Designation';

  constructor(private http: HttpClient) {}

  saveDesignation(designation: Designation): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, designation);
  }

  updateDesignation(id: number, designation: Designation): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, designation);
  }

  deleteDesignation(id: number, actionType: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}?actionType=${actionType}`);
  }

  getDesignationById(id: number): Observable<Designation> {
    return this.http.get<Designation>(`${this.apiUrl}/${id}`);
  }

  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(`${this.apiUrl}/list`);
  }
}