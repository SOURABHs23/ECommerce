import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>ShopHub</h3>
          <p>Your premium shopping destination with the best products and prices.</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <a routerLink="/">Home</a>
          <a routerLink="/products">Products</a>
          <a routerLink="/cart">Cart</a>
        </div>

        <div class="footer-section">
          <h4>Account</h4>
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
          <a routerLink="/orders">Orders</a>
        </div>

        <div class="footer-section">
          <h4>Contact</h4>
          <p>support&#64;shophub.com</p>
          <p>1-800-SHOPHUB</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 ShopHub. All rights reserved.</p>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background: rgba(15, 15, 20, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: auto;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .footer-section h3 {
      font-size: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    .footer-section h4 {
      color: white;
      margin-bottom: 1rem;
    }

    .footer-section p,
    .footer-section a {
      color: rgba(255, 255, 255, 0.6);
      display: block;
      margin-bottom: 0.5rem;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: #667eea;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
    }
  `]
})
export class FooterComponent { }
