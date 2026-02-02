import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, AuthService } from '../../core/services';
import { Cart, CartItem } from '../../core/models';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, CurrencyPipe],
    template: `
    <div class="cart-container">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
        @if (cartService.cart()?.items?.length) {
          <p>{{ cartService.cartItemCount() }} items in your cart</p>
        }
      </div>

      @if (!authService.isAuthenticated()) {
        <div class="auth-prompt">
          <span class="auth-icon">🔐</span>
          <h2>Please sign in to view your cart</h2>
          <a routerLink="/login" [queryParams]="{returnUrl: '/cart'}" class="signin-btn">Sign In</a>
        </div>
      } @else if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
        </div>
      } @else if (!cartService.cart()?.items?.length) {
        <div class="empty-cart">
          <span class="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items yet</p>
          <a routerLink="/products" class="browse-btn">Browse Products</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of cartService.cart()!.items; track item.id) {
              <article class="cart-item">
                <div class="item-image">
                  @if (item.productImage) {
                    <img [src]="item.productImage" [alt]="item.productName" />
                  } @else {
                    <div class="no-image">📦</div>
                  }
                </div>

                <div class="item-details">
                  <h3>{{ item.productName }}</h3>
                  <p class="item-price">{{ item.price | currency }} each</p>
                  
                  @if (!item.inStock) {
                    <span class="stock-warning">⚠️ Limited stock</span>
                  }
                </div>

                <div class="item-quantity">
                  <button (click)="updateQuantity(item, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item, item.quantity + 1)">+</button>
                </div>

                <div class="item-subtotal">
                  <span class="subtotal-label">Subtotal</span>
                  <span class="subtotal-price">{{ item.subtotal | currency }}</span>
                </div>

                <button class="remove-btn" (click)="removeItem(item.id)">
                  <span>×</span>
                </button>
              </article>
            }
          </div>

          <aside class="cart-summary">
            <h2>Order Summary</h2>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cartService.cartTotal() | currency }}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span class="free-shipping">FREE</span>
            </div>

            <div class="summary-total">
              <span>Total</span>
              <span>{{ cartService.cartTotal() | currency }}</span>
            </div>

            <button class="checkout-btn" routerLink="/checkout">
              Proceed to Checkout
            </button>

            <a routerLink="/products" class="continue-shopping">
              ← Continue Shopping
            </a>
          </aside>
        </div>
      }
    </div>
  `,
    styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem 4rem;
    }

    .cart-header {
      margin-bottom: 2rem;
    }

    .cart-header h1 {
      font-size: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .cart-header p {
      color: rgba(255, 255, 255, 0.6);
    }

    .auth-prompt,
    .empty-cart,
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(30, 30, 40, 0.6);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .auth-icon,
    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .auth-prompt h2,
    .empty-cart h2 {
      color: white;
      margin-bottom: 0.5rem;
    }

    .auth-prompt p,
    .empty-cart p {
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 2rem;
    }

    .signin-btn,
    .browse-btn {
      display: inline-block;
      padding: 1rem 2.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .signin-btn:hover,
    .browse-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
      align-items: start;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto auto;
      gap: 1.5rem;
      align-items: center;
      background: rgba(30, 30, 40, 0.6);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .item-image {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(20, 20, 30, 0.8);
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      opacity: 0.3;
    }

    .item-details h3 {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .item-price {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }

    .stock-warning {
      color: #ffa500;
      font-size: 0.85rem;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .item-quantity button {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(30, 30, 40, 0.8);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .item-quantity button:hover:not(:disabled) {
      background: rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    .item-quantity button:disabled {
      opacity: 0.3;
    }

    .item-quantity span {
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }

    .item-subtotal {
      text-align: right;
    }

    .subtotal-label {
      display: block;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.25rem;
    }

    .subtotal-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: white;
    }

    .remove-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 100, 100, 0.2);
      color: #ff6b6b;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: rgba(255, 100, 100, 0.3);
      transform: scale(1.1);
    }

    .cart-summary {
      background: rgba(30, 30, 40, 0.8);
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 6rem;
    }

    .cart-summary h2 {
      color: white;
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .free-shipping {
      color: #6cdf6c;
      font-weight: 600;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
    }

    .checkout-btn {
      width: 100%;
      padding: 1rem;
      margin-top: 1.5rem;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .checkout-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .continue-shopping {
      display: block;
      text-align: center;
      margin-top: 1rem;
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .continue-shopping:hover {
      color: #667eea;
    }

    @media (max-width: 900px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 80px 1fr auto;
      }

      .item-quantity,
      .item-subtotal {
        grid-column: 2;
      }

      .remove-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }

      .cart-item {
        position: relative;
      }
    }
  `]
})
export class CartComponent implements OnInit {
    cartService = inject(CartService);
    authService = inject(AuthService);
    private router = inject(Router);

    loading = false;

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.loading = true;
            this.cartService.getCart().subscribe({
                next: () => this.loading = false,
                error: () => this.loading = false
            });
        }
    }

    updateQuantity(item: CartItem, newQuantity: number): void {
        this.cartService.updateCartItem(item.id, newQuantity).subscribe();
    }

    removeItem(itemId: number): void {
        this.cartService.removeFromCart(itemId).subscribe();
    }
}
