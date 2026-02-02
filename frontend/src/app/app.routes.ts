import { Routes } from '@angular/router';


export const routes: Routes = [
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
        path: '**',
        redirectTo: ''
    }
];
