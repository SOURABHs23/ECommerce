import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService, OrderService, CartService } from '../../../core/services';
import { Address, OrderRequest } from '../../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private addressService = inject(AddressService);
  private orderService = inject(OrderService);
  public cartService = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  addresses = signal<Address[]>([]);
  selectedAddressId = signal<number | null>(null);
  loading = signal(false);
  placingOrder = signal(false);

  // Simple form for new address if needed
  addressForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    addressLine1: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['US', Validators.required],
    type: ['SHIPPING']
  });

  showAddressForm = signal(false);

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.loading.set(true);
    this.addressService.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        if (addresses.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault);
          this.selectedAddressId.set(defaultAddr ? defaultAddr.id : addresses[0].id);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectAddress(id: number): void {
    this.selectedAddressId.set(id);
  }

  toggleAddressForm(): void {
    this.showAddressForm.update(v => !v);
  }

  createNewAddress(): void {
    if (this.addressForm.invalid) return;

    this.loading.set(true);
    this.addressService.createAddress(this.addressForm.value as any).subscribe({
      next: (newAddress) => {
        this.addresses.update(list => [...list, newAddress]);
        this.selectedAddressId.set(newAddress.id);
        this.showAddressForm.set(false);
        this.addressForm.reset({ country: 'US', type: 'SHIPPING' });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  placeOrder(): void {
    if (!this.selectedAddressId()) {
      alert('Please select a shipping address');
      return;
    }

    this.placingOrder.set(true);

    // Create Order Request
    const request: OrderRequest = {
      shippingAddressId: this.selectedAddressId()!,
      paymentMethod: 'CREDIT_CARD', // Hardcoded for now
      notes: ''
    };

    this.orderService.createOrder(request).subscribe({
      next: (order) => {
        this.cartService.refreshCart(); // clear cart locally/fetch empty
        this.placingOrder.set(false);
        alert('Order placed successfully! Check your email for confirmation.');
        this.router.navigate(['/orders']); // Redirect to orders page (if exists) or home
      },
      error: (err) => {
        this.placingOrder.set(false);
        console.error(err);
        alert('Failed to place order. ' + (err.error?.message || ''));
      }
    });
  }
}
