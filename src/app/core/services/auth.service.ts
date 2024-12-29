import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface User {
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAdmin$ = this.isAdminSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkToken();
  }

  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<any>(`${this.apiUrl}/token`, formData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.isAdminSubject.next(true);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next({
          email: response.email,
          username: response.username
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAdminSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      // TODO: Validate token and get user info from backend
      this.isAdminSubject.next(true);
      this.isAuthenticatedSubject.next(true);
      // Temporary user info until we implement the endpoint
      this.currentUserSubject.next({
        email: 'admin@example.com',
        username: 'admin'
      });
    }
  }
}
