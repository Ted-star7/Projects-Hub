import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ServicesService } from '../services/consume.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  step = 1;
  otpTimer = 60;
  otpResendDisabled = true;
  showPassword = false;
  private otpIntervalId?: ReturnType<typeof setInterval>;
  isBrowser = false;

  constructor(
    private router: Router,
    private serviceService: ServicesService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.startOtpTimer(); // Only start OTP timer if in browser
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.otpIntervalId) {
      clearInterval(this.otpIntervalId);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  startOtpTimer(): void {
    this.otpTimer = 60;
    this.otpResendDisabled = true;

    if (this.otpIntervalId) {
      clearInterval(this.otpIntervalId);
    }

    this.otpIntervalId = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        this.otpResendDisabled = false;
        clearInterval(this.otpIntervalId);
      }
    }, 1000);
  }

  showSnackbar(message: string, duration: number = 3000): void {
    if (this.isBrowser) {
      this.snackBar.open(message, 'Close', { duration });
    }
  }

  onEmailSubmit(form: NgForm): void {
    if (!form.valid || !this.email.includes('@')) {
      this.showSnackbar('Please enter a valid email address.');
      return;
    }

    this.isLoading = true;
    this.serviceService.postRequest('/api/open/users/forgot-password', { email: this.email }, null)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.step = 2;
          this.showSnackbar('OTP has been sent to your email.');
          if (this.isBrowser) this.startOtpTimer();
        },
        error: (err) => {
          this.isLoading = false;
          this.showSnackbar('Failed to send OTP. Please try again later.');
          console.error('OTP request error:', err);
        },
      });
  }

  onResendOtp(): void {
    if (this.otpResendDisabled || !this.isBrowser) return;

    this.isLoading = true;
    this.serviceService.postRequest('/api/open/users/resend-otp', { email: this.email }, null)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSnackbar('OTP resent successfully.');
          this.startOtpTimer();
        },
        error: (err) => {
          this.isLoading = false;
          this.showSnackbar('Failed to resend OTP. Try again later.');
          console.error('Resend OTP error:', err);
        },
      });
  }

  onResetSubmit(form: NgForm): void {
    if (!form.valid) {
      this.showSnackbar('Please complete the form properly.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showSnackbar('Passwords do not match.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.showSnackbar('Password must be at least 6 characters long.');
      return;
    }

    const resetPayload = {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword,
    };

    this.isLoading = true;
    this.serviceService.postRequest('/api/open/users/reset-password', resetPayload, null)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSnackbar('Password reset successful! Redirecting...');
          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err) => {
          this.isLoading = false;
          this.showSnackbar('Reset failed. Please check OTP or try again.');
          console.error('Password reset error:', err);
        },
      });
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
