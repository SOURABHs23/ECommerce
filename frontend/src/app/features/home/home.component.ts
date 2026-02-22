import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, Category } from '../../core/models';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    featuredProducts: Product[] = [];
    categories: Category[] = [];
    loading = true;
    welcomeMessage = '';
    isLoggedIn = false;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.isLoggedIn = this.authService.isAuthenticated();
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        if (this.isLoggedIn) {
            this.http.get<any>(`${environment.apiUrl}/home`).subscribe({
                next: (res) => this.welcomeMessage = res.message,
                error: () => { }
            });
        }

        this.productService.getFeaturedProducts().subscribe({
            next: (products) => {
                this.featuredProducts = products;
                this.loading = false;
            },
            error: () => this.loading = false
        });

        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories.filter(c => !c.parentCategoryId);
            }
        });
    }

    getProductImage(product: Product): string {
        return product.images && product.images.length > 0
            ? product.images[0]
            : 'https://via.placeholder.com/300x300?text=No+Image';
    }
}
