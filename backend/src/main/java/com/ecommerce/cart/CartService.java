package com.ecommerce.cart;

import com.ecommerce.cart.CartItemRequest;
import com.ecommerce.cart.CartResponse;
import com.ecommerce.user.User;

public interface CartService {
    CartResponse getCart(User user);

    CartResponse addToCart(CartItemRequest request, User user);

    CartResponse updateCartItem(Long itemId, Integer quantity, User user);

    CartResponse removeFromCart(Long itemId, User user);

    void clearCart(User user);
}
