package com.ecommerce.notification;

import com.ecommerce.order.OrderResponse;
import org.springframework.stereotype.Component;

/**
 * Composes order-specific email HTML content.
 * Keeps the EmailService interface generic (just sends emails) while
 * order-specific formatting lives here.
 */
@Component
public class OrderEmailComposer {

    public String buildOrderEmailContent(String orderNumber, OrderResponse order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h1>Thank you for your order!</h1>");
        sb.append("<p>Your order number is: <strong>").append(orderNumber).append("</strong></p>");
        sb.append("<p>Total Amount: $").append(order.getTotalAmount()).append("</p>");
        sb.append("<h3>Order Items:</h3>");
        sb.append("<ul>");

        if (order.getItems() != null) {
            order.getItems().forEach(item -> {
                sb.append("<li>")
                        .append(item.getProductName())
                        .append(" x ").append(item.getQuantity())
                        .append(" - $").append(item.getSubtotal())
                        .append("</li>");
            });
        }

        sb.append("</ul>");
        sb.append("<p>We will notify you when your items are shipped.</p>");
        sb.append("</body></html>");
        return sb.toString();
    }
}
