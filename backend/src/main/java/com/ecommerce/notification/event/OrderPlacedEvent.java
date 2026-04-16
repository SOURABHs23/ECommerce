package com.ecommerce.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Event published when an order is placed.
 * This is a self-contained DTO — it carries all data the notification
 * service needs so it doesn't depend on JPA entities from the order module.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPlacedEvent {

    private String orderNumber;
    private String customerEmail;
    private String customerName;
    private BigDecimal totalAmount;
    private List<OrderItemDetail> items;

    /**
     * Lightweight snapshot of an order item for the notification.
     * Avoids coupling to the order module's OrderItem JPA entity.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDetail {
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}
