package com.ecommerce.notification;

import com.ecommerce.order.OrderResponse;

import java.util.List;

public interface EmailService {
    void sendOrderConfirmation(String to, String orderNumber, OrderResponse orderDetails);

    void sendEmail(List<String> to, String subject, String message);
}
