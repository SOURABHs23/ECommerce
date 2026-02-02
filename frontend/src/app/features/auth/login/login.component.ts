import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue shopping</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          @if (errorMessage) {
            <div class="error-alert">{{ errorMessage }}</div>
          }

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <span class="field-error">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <span class="field-error">Password is required</span>
            }
          </div>

          <button type="submit" class="submit-btn" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      padding-top: 6rem;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      background: rgba(30, 30, 40, 0.8);
      border-radius: 20px;
      padding: 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .auth-header p {
      color: rgba(255, 255, 255, 0.6);
    }

    .error-alert {
      background: rgba(255, 100, 100, 0.2);
      border: 1px solid rgba(255, 100, 100, 0.3);
      color: #ff6b6b;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(20, 20, 30, 0.8);
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    .form-group input.error {
      border-color: #ff6b6b;
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    .field-error {
      color: #ff6b6b;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      display: block;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    loading = false;
    errorMessage = '';

    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && control.touched);
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.authService.signin(this.loginForm.value).subscribe({
            next: (response) => {
                this.loading = false;
                if (response.success) {
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                } else {
                    this.errorMessage = response.message || 'Login failed';
                }
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
            }
        });
    }
}
