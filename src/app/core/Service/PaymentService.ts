import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../interface/Payments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
    private baseUrl = 'https://localhost:44369/api/Payment';

  constructor(private http: HttpClient) { }

  addPayment(payment: Payment): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create`, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payment);
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/GetAllData`);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/GetDataById/${id}`);
    return this.http.get<Payment>(`${this.baseUrl}/GetDataById?id=${id}`);

  }

  deletePayment(id: number, ActionType : string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
