// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Employee, EnquirySource } from '../interface/IEmployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44369/api/Employee';

  constructor(private http: HttpClient) { }

  createEmployee(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/EmployeeAdd`, formData);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/getEmployeeList`);
  }
  // employee.service.ts
updateEmployee(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, formData, {
    reportProgress: true,
    observe: 'response'
  });
}

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      map(employee => {
        // Transform the employee data if needed
        return employee;
      })
    );
  }
  deleteEmployee(id: number, actionType: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}?actionType=${actionType}`);
  }


// Enquery Service

  private baseUrl = 'https://localhost:44369/api/EnquirySource';

  getEnquerySourceById(id: number): Observable<EnquirySource> {
    return this.http.get<EnquirySource>(`${this.baseUrl}/${id}`);
  }

  EnquerySourcecreate(source: EnquirySource): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create`, source);
  }

  update(id: number, source: EnquirySource): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, source);
  }

  getAllEnquery(): Observable<EnquirySource[]> {
    return this.http.get<EnquirySource[]>(`${this.baseUrl}/GetList`);
  }
  deleteEnquery(id: number, actionType: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}