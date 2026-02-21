package com.ecommerce.order;

import com.ecommerce.order.OrderRequest;
import com.ecommerce.order.OrderResponse;
import com.ecommerce.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);

    OrderResponse createOrder(OrderRequest request, User user);

    OrderResponse getOrderById(Long orderId, Long userId);

    OrderResponse getOrderByNumber(String orderNumber);

    OrderResponse cancelOrder(Long orderId, Long userId);
}
