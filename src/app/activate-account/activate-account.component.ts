import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/consume.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-activate-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  standalone: true,
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent implements OnInit {
  phoneForm: FormGroup;
  isLoading = false;
  isEditing = false;
  userId: string | null = null;
  originalPhoneNumber: string = '';

  constructor(
    private servicesService: ServicesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    private sessionService: SessionService // Inject SessionService
  ) {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  ngOnInit(): void {
    // Get user ID and token from session service
    this.userId = this.sessionService.getUserId();
    const token = this.sessionService.gettoken();
    
    if (this.userId && token) {
      this.fetchUserPhoneNumber(token);
    } else {
      this.snackBar.open('Please login to continue', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/login']);
    }
  }

 fetchUserPhoneNumber(token: string): void {
  this.isLoading = true;

  this.servicesService.getRequest(`/api/phone/${this.userId}`, token).subscribe({
    next: (response) => {
      if (response.body) {
        const raw = response.body.toString().replace(/\D/g, ''); // remove non-digits
        let phone = raw;

        // Normalize to 9-digit format
        if (raw.length === 12 && raw.startsWith('254')) {
          phone = raw.slice(3);
        } else if (raw.length === 13 && raw.startsWith('254')) {
          phone = raw.slice(3); // in case there's an accidental leading "0" after 254
        } else if (raw.length === 10 && raw.startsWith('0')) {
          phone = raw.slice(1);
        }

        this.originalPhoneNumber = phone;
        this.phoneForm.patchValue({ phone });
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching phone number:', error);
      this.snackBar.open('Failed to fetch phone number', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
    }
  });
}


initiatePayment(): void {
  if (this.phoneForm.invalid) {
    this.snackBar.open('Please enter a valid phone number (9 digits without country code)', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    return;
  }

  if (!this.userId) {
    this.snackBar.open('User ID is missing. Please login again.', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    return;
  }

  this.isLoading = true;
  const phoneNumber = `254${this.phoneForm.value.phone}`; // Add country code
  const paymentMode = 'MPESA'; // You can make this dynamic later if needed

  // Append userId as query parameter
  const url = `/api/open/payment/initiate?userId=${this.userId}`;

  // Request body per API spec
  const body = { phoneNumber, paymentMode };

  this.servicesService.postRequest(url, body, null).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response.responseCode === '0') {
        this.snackBar.open('Payment initiated successfully! Check your phone for STK push', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.snackBar.open(response.customerMessage || 'Payment initiation failed', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Payment initiation error:', error);
      this.snackBar.open('Failed to initiate payment. Please try again.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  });
}

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.originalPhoneNumber) {
      this.phoneForm.patchValue({ phone: this.originalPhoneNumber });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      // Here you would typically update the phone number on the server
      this.toggleEdit(); // Just toggle back for now
      return;
    }
    
    this.initiatePayment();
  }
}