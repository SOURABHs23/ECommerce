import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, CartService, AuthService } from '../../../core/services';
import { Product } from '../../../core/models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, MatSnackBarModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

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
      next: () => {
        this.addingToCart.set(false);
        this.snackBar.open(`✓ ${this.product()!.name} added to cart`, 'View Cart', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['cart-snackbar']
        }).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });
      },
      error: () => {
        this.addingToCart.set(false);
        this.snackBar.open('Failed to add product to cart', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['cart-snackbar-error']
        });
      }
    });
  }

  buyNow(): void {
    this.addToCart();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/cart']);
    }
  }
}
