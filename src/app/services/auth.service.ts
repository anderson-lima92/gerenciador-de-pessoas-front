import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: { username: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('http://localhost:8080/auth/login', {
      login: loginData.username,
      password: loginData.password
    }).pipe(
      tap((response: { token: string }) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
      })
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }
}
