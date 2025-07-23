import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CompetitorService {
  private baseUrl = 'https://localhost:44369/api/Competitor';

  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  isDuplicate(name: string, id?: number): Observable<boolean> {
    let params = new HttpParams().set('name', name);
    if (id) {
      params = params.set('id', id);
    }
    return this.http.get<boolean>(`${this.baseUrl}/is-duplicate`, { params });
  }

getAllCompetitors(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/getlist`);
}

deleteCompetitor(id: number, actionType: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/CompetitorDelete/${id}`);
}


}
