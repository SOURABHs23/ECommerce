import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService, CartService, CategoryService } from '../../../core/services';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Product, Category, PageResponse } from '../../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule,
    ProductCardComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
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
