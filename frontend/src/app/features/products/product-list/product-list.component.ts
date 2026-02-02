import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, CartService, CategoryService } from '../../../core/services';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Product, Category, PageResponse } from '../../../core/models';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ProductCardComponent],
    template: `
    <div class="products-container">
      <div class="products-header">
        <h1>Discover Products</h1>
        <p>Find the perfect items for you</p>
      </div>

      <div class="products-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-section">
            <h3>Search</h3>
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (keyup.enter)="searchProducts()"
              placeholder="Search products..."
              class="search-input"
            />
          </div>

          <div class="filter-section">
            <h3>Categories</h3>
            <div class="category-list">
              <button 
                class="category-btn" 
                [class.active]="!selectedCategory"
                (click)="selectCategory(null)">
                All Products
              </button>
              @for (category of categories(); track category.id) {
                <button 
                  class="category-btn"
                  [class.active]="selectedCategory === category.id"
                  (click)="selectCategory(category.id)">
                  {{ category.name }}
                  <span class="count">{{ category.productCount }}</span>
                </button>
              }
            </div>
          </div>

          <div class="filter-section">
            <h3>Price Range</h3>
            <div class="price-inputs">
              <input 
                type="number" 
                [(ngModel)]="minPrice" 
                placeholder="Min" 
                class="price-input"
              />
              <span>-</span>
              <input 
                type="number" 
                [(ngModel)]="maxPrice" 
                placeholder="Max" 
                class="price-input"
              />
            </div>
            <button class="apply-filter-btn" (click)="applyFilters()">Apply Filters</button>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="products-main">
          @if (loading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading products...</p>
            </div>
          } @else if (products().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">📦</span>
              <h2>No products found</h2>
              <p>Try adjusting your filters or search query</p>
            </div>
          } @else {
            <div class="products-grid">
              @for (product of products(); track product.id) {
                <app-product-card 
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                />
              }
            </div>

            @if (pageResponse() && !pageResponse()!.last) {
              <div class="load-more">
                <button class="load-more-btn" (click)="loadMore()" [disabled]="loading()">
                  Load More
                </button>
              </div>
            }
          }
        </main>
      </div>
    </div>
  `,
    styles: [`
    .products-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 6rem 2rem 4rem;
    }

    .products-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .products-header h1 {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .products-header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.1rem;
    }

    .products-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }

    .filters-sidebar {
      background: rgba(30, 30, 40, 0.6);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      height: fit-content;
      position: sticky;
      top: 6rem;
    }

    .filter-section {
      margin-bottom: 2rem;
    }

    .filter-section:last-child {
      margin-bottom: 0;
    }

    .filter-section h3 {
      color: white;
      font-size: 1rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .search-input {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(20, 20, 30, 0.8);
      color: white;
      font-size: 0.9rem;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid transparent;
      background: rgba(20, 20, 30, 0.6);
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
    }

    .category-btn:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .category-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .category-btn .count {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .price-input {
      flex: 1;
      padding: 0.7rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(20, 20, 30, 0.8);
      color: white;
      font-size: 0.9rem;
    }

    .price-inputs span {
      color: rgba(255, 255, 255, 0.5);
    }

    .apply-filter-btn {
      width: 100%;
      padding: 0.8rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .apply-filter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      color: white;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: rgba(255, 255, 255, 0.5);
    }

    .load-more {
      text-align: center;
      margin-top: 2rem;
    }

    .load-more-btn {
      padding: 1rem 3rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: transparent;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .load-more-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .products-layout {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private categoryService = inject(CategoryService);

    products = signal<Product[]>([]);
    categories = signal<Category[]>([]);
    pageResponse = signal<PageResponse<Product> | null>(null);
    loading = signal(false);

    searchQuery = '';
    selectedCategory: number | null = null;
    minPrice: number | null = null;
    maxPrice: number | null = null;
    currentPage = 0;

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.productService.getProducts(this.currentPage).subscribe({
            next: (response) => {
                this.products.set(response.content);
                this.pageResponse.set(response);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => this.categories.set(categories)
        });
    }

    searchProducts(): void {
        if (!this.searchQuery.trim()) {
            this.loadProducts();
            return;
        }

        this.loading.set(true);
        this.currentPage = 0;
        this.productService.searchProducts(this.searchQuery).subscribe({
            next: (response) => {
                this.products.set(response.content);
                this.pageResponse.set(response);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    selectCategory(categoryId: number | null): void {
        this.selectedCategory = categoryId;
        this.currentPage = 0;
        this.loading.set(true);

        if (categoryId) {
            this.productService.getProductsByCategory(categoryId).subscribe({
                next: (response) => {
                    this.products.set(response.content);
                    this.pageResponse.set(response);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else {
            this.loadProducts();
        }
    }

    applyFilters(): void {
        this.loading.set(true);
        this.currentPage = 0;
        this.productService.filterProducts(
            this.selectedCategory ?? undefined,
            this.minPrice ?? undefined,
            this.maxPrice ?? undefined
        ).subscribe({
            next: (response) => {
                this.products.set(response.content);
                this.pageResponse.set(response);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadMore(): void {
        this.currentPage++;
        this.productService.getProducts(this.currentPage).subscribe({
            next: (response) => {
                this.products.update(products => [...products, ...response.content]);
                this.pageResponse.set(response);
            }
        });
    }

    onAddToCart(product: Product): void {
        this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe();
    }
}
