import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, AuthService } from '../../core/services';
import { Cart, CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);

  loading = false;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loading = true;
      this.cartService.getCart().subscribe({
        next: () => this.loading = false,
        error: () => this.loading = false
      });
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    this.cartService.updateCartItem(item.id, newQuantity).subscribe();
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe();
  }
}
