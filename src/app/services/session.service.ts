import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public saveToken(token: string): void {
    if (this.isBrowser) {
      try {
        sessionStorage.setItem('token', token);
      } catch (error) {
        console.error('Error saving token in session storage:', error);
      }
    }
  }

  public savefullName(fullName: string): void {
    if (this.isBrowser) {
      try {
        sessionStorage.setItem('fullName', fullName);
      } catch (error) {
        console.error('Error saving Fullname in session storage:', error);
      }
    }
  }

  public saveEmail(email: string): void {
    if (this.isBrowser) {
      try {
        sessionStorage.setItem('email', email);
      } catch (error) {
        console.error('Error saving email in session storage:', error);
      }
    }
  }

  public saveUserId(userId: string): void {
    if (this.isBrowser) {
      try {
        sessionStorage.setItem('userId', userId);
      } catch (error) {
        console.error('Error saving userId in session storage:', error);
      }
    }
  }

  public getemail(): string | null {
    return this.isBrowser ? sessionStorage.getItem('email') : null;
  }

  public getUserId(): string | null {
    return this.isBrowser ? sessionStorage.getItem('userId') : null;
  }

  public gettoken(): string | null {
    return this.isBrowser ? sessionStorage.getItem('token') : null;
  }

  public getfullName(): string | null {
    return this.isBrowser ? sessionStorage.getItem('fullName') : null;
  }

  public deleteSessions(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('fullName');
    }
  }

  public isLoggedIn(): boolean {
    return this.isBrowser && !!this.gettoken();
  }
}
