package com.ecommerce.service.impl;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    public OrderServiceImpl(OrderRepository orderRepository, CartRepository cartRepository,
            AddressRepository addressRepository, ProductRepository productRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
    }

    @Override
    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(OrderResponse::fromEntity);
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request, User user) {
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Address shippingAddress = addressRepository.findByIdAndUserId(request.getShippingAddressId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setNotes(request.getNotes());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.CONFIRMED);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());

            if (product.getImages() != null && !product.getImages().isEmpty()) {
                orderItem.setProductImage(product.getImages().get(0).getImageUrl());
            }

            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setSubtotal(subtotal);
        order.setShippingCost(BigDecimal.ZERO);
        order.setTax(BigDecimal.ZERO);
        order.setTotalAmount(subtotal.add(order.getShippingCost()).add(order.getTax()));

        order = orderRepository.save(order);

        cart.clear();
        cartRepository.save(cart);

        logger.info("Created order {} for user {}", order.getOrderNumber(), user.getEmail());

        OrderResponse response = OrderResponse.fromEntity(order);
        emailService.sendOrderConfirmation(user.getEmail(), order.getOrderNumber(), response);

        return response;
    }

    @Override
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserIdWithItems(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderResponse.fromEntity(order);
    }

    @Override
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderResponse.fromEntity(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserIdWithItems(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Cannot cancel order in status: " + order.getStatus());
        }

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
}
