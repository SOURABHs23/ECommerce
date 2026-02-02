import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <article class="product-card" [routerLink]="['/products', product.id]">
      <div class="product-image">
        @if (product.images && product.images.length > 0) {
          <img [src]="product.images[0]" [alt]="product.name" />
        } @else {
          <div class="no-image">📦</div>
        }
        @if (product.featured) {
          <span class="featured-badge">Featured</span>
        }
        @if (!product.inStock) {
          <span class="out-of-stock-badge">Out of Stock</span>
        }
      </div>
      
      <div class="product-info">
        <p class="product-category">{{ product.categoryName || 'Uncategorized' }}</p>
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-brand" *ngIf="product.brand">{{ product.brand }}</p>
        
        <div class="product-footer">
          <span class="product-price">{{ product.price | currency }}</span>
          <button 
            class="add-to-cart-btn" 
            (click)="onAddToCart($event)"
            [disabled]="!product.inStock">
            {{ product.inStock ? 'Add to Cart' : 'Sold Out' }}
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .product-card {
      background: rgba(30, 30, 40, 0.6);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .product-card:hover {
      transform: translateY(-8px);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .product-image {
      position: relative;
      aspect-ratio: 1;
      background: rgba(20, 20, 30, 0.8);
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      opacity: 0.3;
    }

    .featured-badge,
    .out-of-stock-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .featured-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .out-of-stock-badge {
      background: rgba(255, 100, 100, 0.9);
      color: white;
    }

    .product-info {
      padding: 1.25rem;
    }

    .product-category {
      color: #667eea;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }

    .product-name {
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-brand {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1rem;
    }

    .product-price {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .add-to-cart-btn {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .add-to-cart-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}
