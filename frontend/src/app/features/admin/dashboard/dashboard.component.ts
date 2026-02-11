import { Component, inject, OnInit, ViewChild, signal, computed, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['product', 'sku', 'price', 'stock', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  loading = signal<boolean>(true);
  products = signal<Product[]>([]);

  // Metrics
  totalProducts = computed(() => this.products().length);
  lowStockCount = computed(() => this.products().filter(p => p.stock > 0 && p.stock < 10).length);
  outOfStockCount = computed(() => this.products().filter(p => p.stock === 0).length);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    effect(() => {
      this.dataSource.data = this.products();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.loading.set(true);
    // Fetching large page size to handle client-side pagination/filtering for demo purposes
    // In a real large app, this should be server-side pagination
    this.productService.getProducts(0, 1000).subscribe({
      next: (response) => {
        this.products.set(response.content);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.showSnack('Failed to load products', 'error');
        this.loading.set(false);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products.update(products => products.filter(p => p.id !== id));
          this.showSnack('Product deleted successfully', 'success');
        },
        error: (err) => {
          console.error('Error deleting product', err);
          this.showSnack('Failed to delete product', 'error');
        }
      });
    }
  }

  private showSnack(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
