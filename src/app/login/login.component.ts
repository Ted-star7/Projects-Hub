import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
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
  imports: [FormsModule, NgIf, RouterModule],
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

  this.servicesService
    .postRequest('/api/open/users/login', payload, null)
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
      if (response?.status === 'success' && response.body) {
        const body = response.body;

        if (body.token) this.sessionService.saveToken(body.token);
        if (body.email) this.sessionService.saveEmail(body.email);
        if (body.userId) this.sessionService.saveUserId(body.userId);
        if (body.fullName) this.sessionService.savefullName(body.fullName);
        if (body.active !== undefined) this.sessionService.setActiveStatus(body.active); // store boolean true/false

        alert(
          body.active
            ? 'Login successful! Redirecting to dashboard...'
            : 'Login successful! Your account is not yet active. Limited access granted.'
        );

        this.router.navigate(['/dashboard']);
      } else {
        alert('Unexpected server response.');
      }
    });
}

}
