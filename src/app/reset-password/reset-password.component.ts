import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services/consume.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading = false;
  step: number = 1; // 1 = enter email, 2 = OTP + new password
  otpTimer: number = 60;
  otpResendDisabled: boolean = true;
  showPassword: boolean = false;

  private otpInterval: any;

  constructor(
    private router: Router,
    private serviceService: ServicesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.startOtpTimer();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  startOtpTimer(): void {
    this.otpTimer = 60;
    this.otpResendDisabled = true;
    if (this.otpInterval) clearInterval(this.otpInterval);

    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        this.otpResendDisabled = false;
        clearInterval(this.otpInterval);
      }
    }, 1000);
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', { duration });
  }

  onEmailSubmit(form: NgForm): void {
    if (!form.valid) {
      this.showSnackbar('Please enter a valid email.');
      return;
    }

    this.isLoading = true;
    this.serviceService.postRequest('/api/open/users/forgot-password',{ email: this.email },null
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSnackbar('OTP has been sent to your email.');
          this.step = 2;
          this.startOtpTimer();
        },
        error: (err) => {
          this.isLoading = false;
          this.showSnackbar('Failed to send OTP. Please try again.');
          console.error('OTP request error:', err);
        },
      });
  }

  onResendOtp(): void {
    if (this.otpResendDisabled) return;

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
          this.showSnackbar('Failed to resend OTP. Please try again.');
          console.error('OTP resend error:', err);
        },
      });
  }

  onResetSubmit(form: NgForm): void {
    if (!form.valid || this.newPassword !== this.confirmPassword) {
      this.showSnackbar(
        'Please fill all fields correctly and make sure passwords match.'
      );
      return;
    }

    this.isLoading = true;
    const resetData = {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword,
    };

    this.serviceService.postRequest('/api/open/users/reset-password', resetData, null)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSnackbar(
            'Password reset successful! Redirecting to login...'
          );
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.isLoading = false;
          this.showSnackbar('Failed to reset password. Please try again.');
          console.error('Password reset error:', err);
        },
      });
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
