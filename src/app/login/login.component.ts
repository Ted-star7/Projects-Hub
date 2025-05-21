import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../services/consume.service';
import { SessionService } from '../services/session.service';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf], 
})
export class LoginComponent {
  isSubmitting = false;
  serverError: string | null = null;

  constructor(
    private servicesService: ServicesService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    this.serverError = null;

    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      email: form.value.email,
      password: form.value.password,
    };

    this.servicesService.postRequest('/api/open/users/login', payload, null) 
      .pipe(
        catchError((error) => {
          this.serverError = error.message || 'Login failed.';
          alert(this.serverError);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe((response) => {
        if (response?.status === 'success') {
          alert('Login successful! Redirecting to dashboard...');
          if (response.body) {
            if (response.body.token) this.sessionService.saveToken(response.body.token);
            if (response.body.email) this.sessionService.saveEmail(response.body.email);
            if (response.body.userId) this.sessionService.saveUserId(response.body.userId);
          }

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        } else {
          alert('Unexpected server response.');
        }
      });
  }
}
