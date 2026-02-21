package com.ecommerce.cart;

public interface CartService {
    CartResponse getCart(Long userId);

    CartResponse addToCart(CartItemRequest request, Long userId);

    CartResponse updateCartItem(Long itemId, Integer quantity, Long userId);

    CartResponse removeFromCart(Long itemId, Long userId);

    void clearCart(Long userId);
}
