import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/core/Service/registerservice';
import { NotificationService } from 'src/app/core/Service/notificationService';

@Component({
    selector: 'app-signup',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService,
    private notificationService: NotificationService,
    private router:Router) {
  }

  ngOnInit(): void {
    this.onFormCrearete();
  }

  onFormCrearete() {
    this.signupForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      referralCode: [''],
      email: ['', [Validators.required, Validators.email]],
      pincode: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      password: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    });
  }

isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = {
        mobile: `+91${this.signupForm.value.mobile}`,  // +91 bhi add kar diya
        referralCode: this.signupForm.value.referralCode,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        pinCode: this.signupForm.value.pincode,
      };

      // UserService ke signup() method ko call karo
      this.userService.signup(formData).subscribe(
        (res) => {
          console.log('User registered successfully!', res);
           this.notificationService.success('You are registered successfully!');
           this.router.navigate(['/Mainlayout']);
          //this.signupForm.reset();
        },
        (error) => {
          console.error('Error registering user:', error);
          this.notificationService.error(error.error?.message || 'Oops! Something went wrong.');
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  // GotoDashboard()
  // {
  //    this.router.navigateByUrl('/signup');
  // }
}
