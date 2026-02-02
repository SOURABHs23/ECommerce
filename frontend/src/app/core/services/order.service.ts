import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderRequest, PageResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getOrders(page = 0, size = 10): Observable<PageResponse<Order>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<Order>>(this.apiUrl, { params });
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    getOrderByNumber(orderNumber: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/number/${orderNumber}`);
    }

    createOrder(request: OrderRequest): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, request);
    }

    cancelOrder(id: number): Observable<Order> {
        return this.http.patch<Order>(`${this.apiUrl}/${id}/cancel`, {});
    }
}
