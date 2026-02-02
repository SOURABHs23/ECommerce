import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, CartService } from '../../../core/services';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <header class="header">
      <nav class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🛒</span>
          <span class="logo-text">ShopHub</span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/products" routerLinkActive="active">Products</a>
        </div>

        <div class="nav-actions">
          <a routerLink="/cart" class="cart-link">
            <span class="cart-icon">🛒</span>
            @if (cartService.cartItemCount() > 0) {
              <span class="cart-badge">{{ cartService.cartItemCount() }}</span>
            }
          </a>

          @if (authService.isAuthenticated()) {
            <a routerLink="/orders" class="nav-btn">Orders</a>
            <button (click)="authService.logout()" class="nav-btn logout-btn">Logout</button>
          } @else {
            <a routerLink="/login" class="nav-btn">Login</a>
            <a routerLink="/register" class="nav-btn primary">Sign Up</a>
          }
        </div>
      </nav>
    </header>
  `,
    styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(15, 15, 20, 0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .logo-icon {
      font-size: 1.8rem;
    }

    .logo-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #667eea;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .cart-link {
      position: relative;
      font-size: 1.5rem;
      text-decoration: none;
      padding: 0.5rem;
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
    }

    .nav-btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .nav-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
    }

    .nav-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .logout-btn {
      font-family: inherit;
      font-size: inherit;
    }
  `]
})
export class HeaderComponent {
    authService = inject(AuthService);
    cartService = inject(CartService);
}
