import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, CategoryService } from '../../../core/services';
import { ProductRequest, Category } from '../../../core/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  errorMessage = '';
  categories = signal<Category[]>([]);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: any) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.price,
          stockQuantity: product.stock,
          categoryId: product.categoryId,
          imageUrl: product.images?.[0] || ''
        });
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load product details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const images = this.productForm.value.imageUrl ? [this.productForm.value.imageUrl] : [];

    const productData: ProductRequest = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      sku: this.productForm.value.sku,
      price: this.productForm.value.price,
      stock: this.productForm.value.stockQuantity,
      categoryId: this.productForm.value.categoryId,
      images: images,
      imageUrls: images // Ensure backward compatibility with backend
    };

    const request = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to save product. ' + (err.error?.message || 'Please try again.');
        this.loading = false;
        console.error(err);
      }
    });
  }
}
