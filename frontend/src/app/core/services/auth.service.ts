import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, SignUpRequest, SignInRequest, User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'auth_token';

    private tokenSignal = signal<string | null>(this.getStoredToken());

    isAuthenticated = computed(() => !!this.tokenSignal());

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    signup(request: SignUpRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request).pipe(
            tap(response => {
                if (response.success && response.token) {
                    this.setToken(response.token);
                }
            }),
            catchError(error => {
                console.error('Signup error:', error);
                return throwError(() => error);
            })
        );
    }

    signin(request: SignInRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, request).pipe(
            tap(response => {
                if (response.success && response.token) {
                    this.setToken(response.token);
                }
            }),
            catchError(error => {
                console.error('Signin error:', error);
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        this.removeToken();
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return this.tokenSignal();
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.tokenSignal.set(token);
    }

    private removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.tokenSignal.set(null);
    }

    private getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }
}
