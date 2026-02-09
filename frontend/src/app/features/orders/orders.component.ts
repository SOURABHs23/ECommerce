import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, PageResponse } from '../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        CurrencyPipe,
        DatePipe,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
    private orderService = inject(OrderService);
    authService = inject(AuthService);

    orders = signal<Order[]>([]);
    loading = signal(true);
    currentPage = 0;
    hasMore = signal(false);

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading.set(true);
        this.orderService.getOrders(this.currentPage).subscribe({
            next: (response: PageResponse<Order>) => {
                this.orders.set(response.content);
                this.hasMore.set(!response.last);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadMore(): void {
        this.currentPage++;
        this.orderService.getOrders(this.currentPage).subscribe({
            next: (response: PageResponse<Order>) => {
                this.orders.update(orders => [...orders, ...response.content]);
                this.hasMore.set(!response.last);
            }
        });
    }

    cancelOrder(orderId: number): void {
        if (confirm('Are you sure you want to cancel this order?')) {
            this.orderService.cancelOrder(orderId).subscribe({
                next: (updatedOrder: Order) => {
                    this.orders.update(orders =>
                        orders.map(o => o.id === orderId ? updatedOrder : o)
                    );
                },
                error: (err: { error?: { message?: string } }) => {
                    alert('Failed to cancel order: ' + (err.error?.message || 'Unknown error'));
                }
            });
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'PENDING': return 'accent';
            case 'CONFIRMED': return 'primary';
            case 'SHIPPED': return 'primary';
            case 'DELIVERED': return 'primary';
            case 'CANCELLED': return 'warn';
            default: return '';
        }
    }

    canCancel(status: string): boolean {
        return status === 'PENDING' || status === 'CONFIRMED';
    }
}
