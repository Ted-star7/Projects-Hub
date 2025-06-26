import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStatusGuard implements CanActivate, CanActivateChild {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(): boolean {
  if (this.sessionService.isLoggedIn() && this.sessionService.isActive()) {
    return true;
  }
  alert('This section is only for active accounts.');
  this.router.navigate(['/dashboard']);
  return false;
}


  canActivateChild(): boolean {
    return this.canActivate();
  }
}
