import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/Service/registerservice';

@Component({
  selector: 'app-signup',
  standalone:true,
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // or .scss if using SCSS
})
export class RegisterComponent {
  signupForm!: FormGroup;
  isOtpSent = false;
  otpInput = '';
  successMessage = '';
  errorMessage = '';

  otpInputs: string[] = ['', '', '', '', '', ''];
  isOtpModalVisible = false;
  isOtpVerified = false;
  timer = 120; // 30 second timer
  timerInterval: any;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.formCreate();
  }

  formCreate() {
    this.signupForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      referralCode: [''],
      password: ['', Validators.required]
    });
  }

getInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value || '';
}


  sendOtp(): void {
    if (this.signupForm.get('mobile')?.invalid) return;
    const rawMobile = this.signupForm.value.mobile; // e.g. "9876543210"
    const internationalMobile = `+91${rawMobile}`;

    this.userService.sendOtp(internationalMobile).subscribe(
      () => {
        this.isOtpModalVisible = true;
        this.startTimer();
      }
    );
  }

  verifyOtp(): void {
    const otp = this.otpInputs.join('');
    this.userService.verifyOtp(this.signupForm.get('mobile')?.value, otp).subscribe(
      () => {
        this.isOtpModalVisible = false;
        this.isOtpVerified = true;
        clearInterval(this.timerInterval);
      }
    );
  }

  startTimer(): void {
    this.timer = 120;
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 2000);
  }

  register(): void {
    if (this.signupForm.invalid || !this.isOtpVerified) return;
    this.userService.registerUser(this.signupForm.value).subscribe(
      res => alert('User registered successfully!')
    );
  }
}
