import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';


export const routes: Routes = [
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
                title: 'Admin Dashboard'
            },
            {
                path: 'products/new',
                loadComponent: () => import('./features/admin/product-form/product-form.component').then(m => m.ProductFormComponent),
                title: 'Add New Product'
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./features/products/product-list/product-list.component')
            .then(m => m.ProductListComponent),
        title: 'ShopHub - Home'
    },
    {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list.component')
            .then(m => m.ProductListComponent),
        title: 'Products - ShopHub'
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail/product-detail.component')
            .then(m => m.ProductDetailComponent),
        title: 'Product Details - ShopHub'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component')
            .then(m => m.LoginComponent),
        title: 'Sign In - ShopHub'
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component')
            .then(m => m.RegisterComponent),
        title: 'Create Account - ShopHub'
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component')
            .then(m => m.CartComponent),
        title: 'Shopping Cart - ShopHub'
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout/checkout.component')
            .then(m => m.CheckoutComponent),
        title: 'Checkout - ShopHub'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
