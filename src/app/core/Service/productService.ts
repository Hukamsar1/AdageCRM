import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://localhost:44369/api/Product';

  constructor(private http: HttpClient) {}

  /** CREATE */
  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ProductCreate`, product);
  }

  /** UPDATE */
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ProductUpdate/${id}`, product);
  }

  /** DELETE */
  deleteProduct(id: number, actionType: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ProductDelete/${id}`);
  }

  /** GET ALL */
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ProductList`);
  }

  /** GET BY ID */
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ProductGetById/${id}`);
  }

checkDuplicateProductName(name: string, id: number) {
  return this.http.get<boolean>(`${this.apiUrl}/CheckDuplicate`, {
    params: { name, id }
  });
}


}
