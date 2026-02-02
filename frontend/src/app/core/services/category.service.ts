import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    getRootCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/roots`);
    }

    createCategory(category: CategoryRequest): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, category);
    }

    updateCategory(id: number, category: CategoryRequest): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
    }
}
