import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start shopping</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          @if (errorMessage) {
            <div class="error-alert">{{ errorMessage }}</div>
          }

          <div class="form-row">
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input 
                id="firstname" 
                type="text" 
                formControlName="firstname"
                placeholder="John"
                [class.error]="isFieldInvalid('firstname')"
              />
            </div>

            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input 
                id="lastname" 
                type="text" 
                formControlName="lastname"
                placeholder="Doe"
                [class.error]="isFieldInvalid('lastname')"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              placeholder="john.doe&#64;example.com"
              [class.error]="isFieldInvalid('email')"
            />
          </div>

          <div class="form-group">
            <label for="mobile">Mobile Number</label>
            <input 
              id="mobile" 
              type="tel" 
              formControlName="mobile"
              placeholder="9876543210"
              [class.error]="isFieldInvalid('mobile')"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              placeholder="Create a strong password"
              [class.error]="isFieldInvalid('password')"
            />
          </div>

          <button type="submit" class="submit-btn" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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
      max-width: 480px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
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
      margin-top: 0.5rem;
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
  `]
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = false;
    errorMessage = '';

    isFieldInvalid(field: string): boolean {
        const control = this.registerForm.get(field);
        return !!(control && control.invalid && control.touched);
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        const formData = {
            ...this.registerForm.value,
            mobile: Number(this.registerForm.value.mobile)
        };

        this.authService.signup(formData).subscribe({
            next: (response) => {
                this.loading = false;
                if (response.success) {
                    this.router.navigate(['/']);
                } else {
                    this.errorMessage = response.message || 'Registration failed';
                }
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
            }
        });
    }
}
