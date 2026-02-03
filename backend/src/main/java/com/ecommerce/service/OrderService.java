package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository,
            AddressRepository addressRepository, ProductRepository productRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
    }

    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(OrderResponse::fromEntity);
    }
    // ... existing methods ...

    @Transactional
    public OrderResponse createOrder(OrderRequest request, User user) {
        // ... (existing logic) ...

        // Get cart
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Get shipping address
        Address shippingAddress = addressRepository.findByIdAndUserId(request.getShippingAddressId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setNotes(request.getNotes());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;

        // Add items and calculate totals
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Check stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());

            // Get first image if exists
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                orderItem.setProductImage(product.getImages().get(0).getImageUrl());
            }

            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());

            // Reduce stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setSubtotal(subtotal);
        order.setShippingCost(BigDecimal.ZERO); // Free shipping for now
        order.setTax(BigDecimal.ZERO); // No tax for now
        order.setTotalAmount(subtotal.add(order.getShippingCost()).add(order.getTax()));

        order = orderRepository.save(order);

        // Clear cart after order
        cart.clear();
        cartRepository.save(cart);

        logger.info("Created order {} for user {}", order.getOrderNumber(), user.getEmail());

        // Send confirmation email
        OrderResponse response = OrderResponse.fromEntity(order);
        emailService.sendOrderConfirmation(user.getEmail(), order.getOrderNumber(), response);

        return response;
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserIdWithItems(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderResponse.fromEntity(order);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserIdWithItems(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Cannot cancel order in status: " + order.getStatus());
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        logger.info("Cancelled order {}", order.getOrderNumber());
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        order = orderRepository.save(order);

        logger.info("Updated order {} status to {}", order.getOrderNumber(), status);
        return OrderResponse.fromEntity(order);
    }
}
