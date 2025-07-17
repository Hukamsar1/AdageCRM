import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// This interface matches your .NET TargetIncentiveModel
export interface TargetIncentive {
  targetIncentiveId?: number;
  periodTime: string;
  month?: string;
  week?: string;
  fromDate?: string;
  toDate?: string;
  targetType: string;
  targetValue: number;
  incentiveType: string;
  incentiveValue: number;
  unitType: string;
  createdDate?: string;
  isUpdated?: string;
  isDeleted: boolean;
  actionType: string;
}

export interface WeekTarget {
  label: string;
  range: string;
  value: number;
  calculatedValue: number;
}

export interface TargetIncentives {
  periodTime: string;
  month: string;
  quarter: string;
  year: string;
  targetType: string;
  targetValue: number;
  actionType: string;
  createdDate: string;
  isUpdated: string;
  isDeleted: boolean;
  weekTargets: WeekTarget[];
}


@Injectable({
  providedIn: 'root'
})
export class TargetIncentiveService {

  private apiUrl = 'https://localhost:44369/api/TargetIncentive';
  constructor(private http: HttpClient) { }

  getAllTargetIncentives(): Observable<TargetIncentive[]> {
    return this.http.get<TargetIncentive[]>(this.apiUrl);
  }

  getTargetIncentiveById(id: number): Observable<TargetIncentive> {
    return this.http.get<TargetIncentive>(`${this.apiUrl}/${id}`);
  }

  addTargetIncentive(data: TargetIncentive): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create`, data);
  }

  updateTargetIncentive(id: number, data: TargetIncentive): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteTargetIncentive(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

    /** Save Target Incentive */
  createTargetIncentive(data: TargetIncentive): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/TargetCreate`, data, { headers });
  }
}
