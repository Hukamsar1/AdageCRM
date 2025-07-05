import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private apiUrl = 'https://localhost:44369/api/Lead';  // Your actual API base

  constructor(private http: HttpClient) {}

  createLead(leadData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create`, leadData);
  }

    getAllBussiness(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetList`);
  }

  getAllBussinessDAta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAll`);
  }

  getAllCompanyName(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetCompanyNameList`);
  }

  getAllDataByCompanyName(businessName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDataByCompanyName`, {
      params: { businessName }
    });
  }

}
