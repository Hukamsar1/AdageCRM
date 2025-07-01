import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Department {
  departmentId?: number;
  departmentName: string;
  underDepartment?: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = 'https://localhost:44369/api';

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/department/GetList`);
  }

  createDepartment(payload: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/department/Add`, payload);
  }

  getDepartmentById(departmentId: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/department/${departmentId}`);
  }

  updateDepartment(id: number, payload: Department): Observable<any> {
    return this.http.put(`${this.apiUrl}/department/update/${id}`, payload); 
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/department/delete/${id}`);
  }
}
