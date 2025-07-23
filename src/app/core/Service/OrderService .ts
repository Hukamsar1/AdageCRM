import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrderDto {
  order: string;
  customer: string;
  product: string;
  quantity: number;
  discount: number;
  amount: number;
  ActionType: 'create' | 'update';
  createdDate: string;
  isUpdated: string;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:44369/api/Order';

  constructor(private http: HttpClient)
  {}

  saveOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/OrderCreate`, orderData);
  }

  /** GET all orders */
  getAllOrder(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /** GET order by ID */
  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetById/${id}`);
  }

  /** UPDATE order */
  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, order);
  }

  /** DELETE (soft‑delete) order */
  deleteOrder(id: number, ActionType: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

