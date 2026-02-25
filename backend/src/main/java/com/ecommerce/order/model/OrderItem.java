package com.ecommerce.order.model;

import com.ecommerce.product.model.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_items")
@EntityListeners(AuditingEntityListener.class)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // Snapshot of product name (in case product is deleted later)
    @Column(nullable = false)
    private String productName;

    // Snapshot of product image
    private String productImage;

    @Column(nullable = false)
    private Integer quantity;

    // Price at time of purchase
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal priceAtPurchase;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Calculate subtotal
    public BigDecimal getSubtotal() {
        return priceAtPurchase.multiply(BigDecimal.valueOf(quantity));
    }
}
