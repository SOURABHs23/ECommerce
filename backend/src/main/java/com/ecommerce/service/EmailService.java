package com.ecommerce.service;

import java.util.List;

public interface EmailService {
    void sendOrderConfirmation(String to, String orderNumber, Object orderDetails);

    void sendEmail(List<String> to, String subject, String message);
}
