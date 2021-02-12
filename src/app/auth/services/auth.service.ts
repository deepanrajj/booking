import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isUserAuthenticated = true;
  private userId = 'xyz';
  constructor() { }

  get isUserLoggedIn(): boolean {
    return this.isUserAuthenticated;
  }

  get getUserId(): string {
    return this.userId;
  }

  login(): void {
    this.isUserAuthenticated = true;
  }

  logout(): void {
    this.isUserAuthenticated = false;
  }
}
