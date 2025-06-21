import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor() {}

  // Called when the Sign In button is clicked
  onSignIn(): void {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    this.isLoading = true;

    // Simulate an async login call
    setTimeout(() => {
      this.isLoading = false;
      // Here you would normally navigate or call your auth service
      console.log('Logged in with:', { email: this.email, password: this.password });

      // Navigate to dashboard after successful login
      // this.router.navigate(['/dashboard']); // <-- uncomment if Router is injected
    }, 1000);
  }

  // Dummy action for "Set My PIN"
  onSetPin(): void {
    alert('Redirecting to Set PIN page...');
    // this.router.navigate(['/set-pin']); // <-- uncomment if Router is injected
  }
}
