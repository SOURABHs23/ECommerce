import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, CartService, AuthService } from '../../../core/services';
import { Product } from '../../../core/models';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    template: `
    <div class="product-detail-container">
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
        </div>
      } @else if (product()) {
        <div class="product-detail">
          <div class="product-gallery">
            <div class="main-image">
              @if (product()!.images && product()!.images.length > 0) {
                <img [src]="selectedImage()" [alt]="product()!.name" />
              } @else {
                <div class="no-image">📦</div>
              }
            </div>
            @if (product()!.images && product()!.images.length > 1) {
              <div class="thumbnail-list">
                @for (image of product()!.images; track $index) {
                  <button 
                    class="thumbnail" 
                    [class.active]="selectedImage() === image"
                    (click)="selectImage(image)">
                    <img [src]="image" [alt]="product()!.name" />
                  </button>
                }
              </div>
            }
          </div>

          <div class="product-info">
            @if (product()!.featured) {
              <span class="featured-badge">⭐ Featured</span>
            }
            
            <p class="product-category">{{ product()!.categoryName || 'Uncategorized' }}</p>
            <h1 class="product-name">{{ product()!.name }}</h1>
            
            @if (product()!.brand) {
              <p class="product-brand">by {{ product()!.brand }}</p>
            }

            <div class="product-price">
              <span class="price">{{ product()!.price | currency }}</span>
              @if (product()!.inStock) {
                <span class="stock-badge in-stock">✓ In Stock</span>
              } @else {
                <span class="stock-badge out-of-stock">Out of Stock</span>
              }
            </div>

            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product()!.description || 'No description available.' }}</p>
            </div>

            <div class="product-meta">
              @if (product()!.sku) {
                <p><strong>SKU:</strong> {{ product()!.sku }}</p>
              }
              <p><strong>Available:</strong> {{ product()!.stock }} units</p>
            </div>

            <div class="quantity-section">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button (click)="decreaseQuantity()" [disabled]="quantity() <= 1">-</button>
                <span>{{ quantity() }}</span>
                <button (click)="increaseQuantity()" [disabled]="quantity() >= product()!.stock">+</button>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                class="add-to-cart-btn"
                (click)="addToCart()"
                [disabled]="!product()!.inStock || addingToCart()">
                {{ addingToCart() ? 'Adding...' : 'Add to Cart' }}
              </button>
              <button class="buy-now-btn" (click)="buyNow()" [disabled]="!product()!.inStock">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="not-found">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      }
    </div>
  `,
    styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem 4rem;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .product-gallery {
      position: sticky;
      top: 6rem;
    }

    .main-image {
      aspect-ratio: 1;
      background: rgba(30, 30, 40, 0.6);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 1rem;
    }

    .main-image img {
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
      font-size: 6rem;
      opacity: 0.3;
    }

    .thumbnail-list {
      display: flex;
      gap: 0.75rem;
    }

    .thumbnail {
      width: 70px;
      height: 70px;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid transparent;
      background: rgba(30, 30, 40, 0.6);
      cursor: pointer;
      padding: 0;
      transition: all 0.3s ease;
    }

    .thumbnail.active {
      border-color: #667eea;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      padding: 1rem 0;
    }

    .featured-badge {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .product-category {
      color: #667eea;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }

    .product-name {
      font-size: 2.25rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    .product-brand {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stock-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .stock-badge.in-stock {
      background: rgba(100, 200, 100, 0.2);
      color: #6cdf6c;
    }

    .stock-badge.out-of-stock {
      background: rgba(255, 100, 100, 0.2);
      color: #ff6b6b;
    }

    .product-description {
      margin-bottom: 2rem;
    }

    .product-description h3 {
      color: white;
      margin-bottom: 0.75rem;
    }

    .product-description p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.7;
    }

    .product-meta {
      margin-bottom: 2rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .product-meta p {
      margin-bottom: 0.5rem;
    }

    .product-meta strong {
      color: rgba(255, 255, 255, 0.8);
    }

    .quantity-section {
      margin-bottom: 2rem;
    }

    .quantity-section label {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .quantity-controls button {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(30, 30, 40, 0.8);
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quantity-controls button:hover:not(:disabled) {
      background: rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    .quantity-controls button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .quantity-controls span {
      font-size: 1.25rem;
      font-weight: 600;
      min-width: 40px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .add-to-cart-btn,
    .buy-now-btn {
      flex: 1;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-to-cart-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .buy-now-btn {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
    }

    .buy-now-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    .add-to-cart-btn:disabled,
    .buy-now-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .not-found {
      text-align: center;
      padding: 4rem;
    }

    .not-found h2 {
      color: white;
      margin-bottom: 0.5rem;
    }

    .not-found p {
      color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
      }

      .product-gallery {
        position: static;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private authService = inject(AuthService);

    product = signal<Product | null>(null);
    loading = signal(true);
    selectedImage = signal<string>('');
    quantity = signal(1);
    addingToCart = signal(false);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadProduct(id);
        }
    }

    loadProduct(id: number): void {
        this.productService.getProductById(id).subscribe({
            next: (product) => {
                this.product.set(product);
                if (product.images && product.images.length > 0) {
                    this.selectedImage.set(product.images[0]);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    selectImage(image: string): void {
        this.selectedImage.set(image);
    }

    increaseQuantity(): void {
        if (this.product() && this.quantity() < this.product()!.stock) {
            this.quantity.update(q => q + 1);
        }
    }

    decreaseQuantity(): void {
        if (this.quantity() > 1) {
            this.quantity.update(q => q - 1);
        }
    }

    addToCart(): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
            return;
        }

        this.addingToCart.set(true);
        this.cartService.addToCart({
            productId: this.product()!.id,
            quantity: this.quantity()
        }).subscribe({
            next: () => this.addingToCart.set(false),
            error: () => this.addingToCart.set(false)
        });
    }

    buyNow(): void {
        this.addToCart();
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/cart']);
        }
    }
}
