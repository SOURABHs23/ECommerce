import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest, PageResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(page = 0, size = 12): Observable<PageResponse<Product>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Product>>(this.apiUrl, { params });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    searchProducts(query: string, page = 0, size = 12): Observable<PageResponse<Product>> {
        const params = new HttpParams()
            .set('query', query)
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Product>>(`${this.apiUrl}/search`, { params });
    }

    filterProducts(
        categoryId?: number,
        minPrice?: number,
        maxPrice?: number,
        page = 0,
        size = 12
    ): Observable<PageResponse<Product>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (categoryId) params = params.set('categoryId', categoryId.toString());
        if (minPrice) params = params.set('minPrice', minPrice.toString());
        if (maxPrice) params = params.set('maxPrice', maxPrice.toString());

        return this.http.get<PageResponse<Product>>(`${this.apiUrl}/filter`, { params });
    }

    getProductsByCategory(categoryId: number, page = 0, size = 12): Observable<PageResponse<Product>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Product>>(`${this.apiUrl}/category/${categoryId}`, { params });
    }

    getFeaturedProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/featured`);
    }

    createProduct(product: ProductRequest): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: number, product: ProductRequest): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
