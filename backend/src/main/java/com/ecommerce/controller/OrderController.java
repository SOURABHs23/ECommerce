package com.ecommerce.controller;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository) {
        this.orderService = orderService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getUserOrders(
            HttpServletRequest request,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(orderService.getUserOrders(user.getId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(orderService.getOrderById(id, user.getId()));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest orderRequest,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        OrderResponse order = orderService.createOrder(orderRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(orderService.cancelOrder(id, user.getId()));
    }

    private User getCurrentUser(HttpServletRequest request) {
        String jwt = JwtUtils.extractJwtFromRequest(request);
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
