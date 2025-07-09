import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private apiUrl = 'https://localhost:44369/api/Lead';  // Your actual API base

  constructor(private http: HttpClient) { }

  createLead(leadData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create`, leadData);
  }

  getLeadById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetById/${id}`).pipe(
      map(lead => {
        // Transform the employee data if needed
        return lead;
      })
    );
  }

  updateLead(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateLead`, data);
  }

deleteLead(id: number, actionType: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete/${id}?actionType=${actionType}`);
}

  getAllBussiness(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetList`);
  }

  getAllBussinessDAta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAll`);
  }

getClosureData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/GetClosureData`);
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
