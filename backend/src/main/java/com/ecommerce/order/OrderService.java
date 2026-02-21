package com.ecommerce.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);

    OrderResponse createOrder(OrderRequest request, Long userId);

    OrderResponse getOrderById(Long orderId, Long userId);

    OrderResponse getOrderByNumber(String orderNumber);

    OrderResponse cancelOrder(Long orderId, Long userId);
}
