package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);

    OrderResponse createOrder(OrderRequest request, User user);

    OrderResponse getOrderById(Long orderId, Long userId);

    OrderResponse getOrderByNumber(String orderNumber);

    OrderResponse cancelOrder(Long orderId, Long userId);
}
