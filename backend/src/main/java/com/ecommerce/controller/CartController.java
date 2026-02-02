package com.ecommerce.controller;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public CartController(CartService cartService, JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository) {
        this.cartService = cartService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartItemRequest itemRequest,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(cartService.addToCart(itemRequest, user));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(cartService.updateCartItem(itemId, quantity, user));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long itemId,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(cartService.removeFromCart(itemId, user));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(HttpServletRequest request) {
        User user = getCurrentUser(request);
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(HttpServletRequest request) {
        String jwt = JwtUtils.extractJwtFromRequest(request);
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
