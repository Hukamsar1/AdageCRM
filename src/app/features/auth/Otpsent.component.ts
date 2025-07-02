import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/Service/registerservice';

@Component({
    selector: 'app-signup',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './Otpsent.component.html',
    styleUrls: ['./Otpsent.component.scss'] // or .scss if using SCSS
})
export class OTPSentComponent {
  signupForm!: FormGroup;
  isOtpSent = false;
  otpInput = '';
  successMessage = '';
  errorMessage = '';
  isOtpModalVisible = false;
  isOtpVerified = false;
  timer = 120; // 30 second timer
  timerInterval: any;

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) { }

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
  const otp = this.otpInput;
  const mobile = this.signupForm.get('mobile')?.value;
  const formattedMobile = `+91${mobile}`;

  this.userService.verifyOtp(formattedMobile, otp).subscribe(
    res => {
      console.log('Verified:', res);
      if (res) {
        this.goToSignup();
        // OTP verified successfully
        this.isOtpModalVisible = false; // Modal band kar do
        this.isOtpVerified = true;       // Password field dikhao
        clearInterval(this.timerInterval); // Timer band kar do
      }
    },
    err => {
      console.error('Error:', err);
      // Error message dikhana chaho to yaha dikhado
    }
  );
}

  goToSignup() {
    this.router.navigateByUrl('/signup');

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
