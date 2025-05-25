import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../services/consume.service'; 
import { SessionService } from '../services/session.service';   
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule],  
})
export class RegistrationComponent {
  isSubmitting = false;
  serverError: string | null = null;

  constructor(
    private servicesService: ServicesService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  passwordsMatch(form?: NgForm): boolean {
    if (!form) return true; 

    const pwd = form.value.password;
    const confirm = form.value.confirmPassword;
    return pwd === confirm;
  }

  onSubmit(form: NgForm) {
    this.serverError = null;

    if (!form.valid || !this.passwordsMatch(form)) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      email: form.value.email,
      password: form.value.password,
      fullName: form.value.fullname,
      username: form.value.username,
      phone: form.value.phonenumber,
    };

    this.servicesService
      .postRequest('/api/open/users/register', payload, null)
      .pipe(
        catchError((error) => {
          this.serverError = error.message || 'Registration failed.';
          alert(this.serverError);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe((response) => {
        if (response?.status === 'success' || response?.message) {
          alert(response.message || 'Registration successful! Redirecting to activate-account...');
          
          if (response.body) {
            if (response.body.token) this.sessionService.saveToken(response.body.token);
            if (response.body.email) this.sessionService.saveEmail(response.body.email);
            if (response.body.userId) this.sessionService.saveUserId(response.body.userId);
            if (response.body.fullName) this.sessionService.savefullName(response.body.fullName);
          }

          setTimeout(() => {
            this.router.navigate(['/activate-account']);
          }, 1800);
          form.resetForm();
        } else {
          alert('Unexpected server response.');
        }
      });
  }
}
