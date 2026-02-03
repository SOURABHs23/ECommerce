import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductRequest } from '../../../core/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    sku: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [1, Validators.required], // Hardcoded for now, ideal: load from API
    imageUrl: ['', Validators.required],
    active: [true]
  });

  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.productForm.value;
    const productRequest: ProductRequest = {
      name: formValue.name,
      description: formValue.description,
      sku: formValue.sku,
      price: Number(formValue.price),
      stock: Number(formValue.stockQuantity),
      categoryId: Number(formValue.categoryId),
      imageUrls: [formValue.imageUrl],
      featured: false
    };

    this.productService.createProduct(productRequest).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']); // Redirect to home/dashboard
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to create product';
        console.error('Error creating product:', error);
      }
    });
  }
}
