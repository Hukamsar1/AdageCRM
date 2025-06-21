import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUserRequest } from '../interface/Iregister';

@Injectable({ providedIn: 'root' })

export class UserService {
  private apiUrl = 'https://localhost:44369/api'; // apni API ka URL yaha dalo

  constructor(private http: HttpClient) {}

  registerUser(request: RegisterUserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/register`, request);
  }


  sendOtp(mobile: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/User/sendOtp`, { mobile }); 
}

verifyOtp(mobile: string, otp: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/User/verifyOtp`, { mobile, otp }); 
}

}
