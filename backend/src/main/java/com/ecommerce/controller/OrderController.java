package com.ecommerce.controller;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getUserOrders(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrderById(id, user.getId()));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest orderRequest,
            @AuthenticationPrincipal User user) {
        OrderResponse order = orderService.createOrder(orderRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.cancelOrder(id, user.getId()));
    }
}
