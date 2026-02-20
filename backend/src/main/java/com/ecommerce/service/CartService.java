package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.User;

public interface CartService {
    CartResponse getCart(User user);

    CartResponse addToCart(CartItemRequest request, User user);

    CartResponse updateCartItem(Long itemId, Integer quantity, User user);

    CartResponse removeFromCart(Long itemId, User user);

    void clearCart(User user);
}
