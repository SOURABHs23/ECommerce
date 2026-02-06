package com.ecommerce.controller;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartItemRequest itemRequest,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.addToCart(itemRequest, user));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.updateCartItem(itemId, quantity, user));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long itemId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.removeFromCart(itemId, user));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
