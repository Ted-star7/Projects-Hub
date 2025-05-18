import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  public saveToken(token: string): void {
    try {
      sessionStorage.setItem('token', token);
    } catch (error) {
      console.error('Error saving token in session storage:', error);
    }
  }

  public saveEmail(email: string): void{
    try{
      sessionStorage.setItem('email',email);
    }catch (error){
      console.error('Error saving email in session storage:', error);
    }
  }

  public saveUserId(userId: string): void {
    try {
      sessionStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Error saving userId in session storage:', error);
    }
  }



  public getemail(): string| null{
    return sessionStorage.getItem('email');
  }
  public getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  public gettoken(): string| null{
    return sessionStorage.getItem('token');
  }

 

  public deleteSessions(): void{
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
   
  }

  public isLoggedIn(): boolean{
    return !! this.gettoken();
  }
}