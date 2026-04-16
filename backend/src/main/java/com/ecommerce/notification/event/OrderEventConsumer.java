package com.ecommerce.notification.event;

import java.util.stream.Collectors;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.ecommerce.notification.config.KafkaConfig;
import com.ecommerce.notification.service.EmailService;
import com.ecommerce.order.dto.OrderResponse;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@AllArgsConstructor
public class OrderEventConsumer {

    private final EmailService emailService;

    @KafkaListener(topics = KafkaConfig.ORDER_PLACED_TOPIC, groupId = "notification-group")

    public void listen(OrderPlacedEvent event) {
        log.info("Order placed event received: {}", event);

        OrderResponse orderResponse = OrderResponse.builder()
                .orderNumber(event.getOrderNumber())
                .totalAmount(event.getTotalAmount())
                .items(event.getItems().stream()
                        .map(item -> OrderResponse.OrderItemResponse.builder()
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .subtotal(item.getSubtotal())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        emailService.sendOrderConfirmation(
                event.getCustomerEmail(),
                event.getOrderNumber(),
                orderResponse);
    }

}
