import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://localhost:44369/api/Product';
  
  constructor(private http: HttpClient) {}

  createProduct(product: any) {
    return this.http.post(`${this.apiUrl}/ProductCreate`, product);
  }
}
