import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart, CartItemRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly apiUrl = `${environment.apiUrl}/cart`;

    private cartSignal = signal<Cart | null>(null);

    cart = computed(() => this.cartSignal());
    cartItemCount = computed(() => this.cartSignal()?.totalItems ?? 0);
    cartTotal = computed(() => this.cartSignal()?.totalAmount ?? 0);

    constructor(private http: HttpClient) { }

    getCart(): Observable<Cart> {
        return this.http.get<Cart>(this.apiUrl).pipe(
            tap(cart => this.cartSignal.set(cart))
        );
    }

    addToCart(request: CartItemRequest): Observable<Cart> {
        return this.http.post<Cart>(`${this.apiUrl}/items`, request).pipe(
            tap(cart => this.cartSignal.set(cart))
        );
    }

    updateCartItem(itemId: number, quantity: number): Observable<Cart> {
        return this.http.put<Cart>(`${this.apiUrl}/items/${itemId}?quantity=${quantity}`, {}).pipe(
            tap(cart => this.cartSignal.set(cart))
        );
    }

    removeFromCart(itemId: number): Observable<Cart> {
        return this.http.delete<Cart>(`${this.apiUrl}/items/${itemId}`).pipe(
            tap(cart => this.cartSignal.set(cart))
        );
    }

    clearCart(): Observable<void> {
        return this.http.delete<void>(this.apiUrl).pipe(
            tap(() => this.cartSignal.set(null))
        );
    }

    refreshCart(): void {
        this.getCart().subscribe();
    }
}
