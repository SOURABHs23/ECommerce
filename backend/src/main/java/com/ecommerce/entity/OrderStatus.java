package com.ecommerce.entity;

/**
 * Enum representing the status of an order
 */
public enum OrderStatus {
    PENDING, // Order placed, awaiting payment/confirmation
    CONFIRMED, // Payment confirmed
    PROCESSING, // Being prepared for shipment
    SHIPPED, // Shipped to customer
    DELIVERED, // Successfully delivered
    CANCELLED, // Cancelled by user or system
    REFUNDED // Payment refunded
}
