package com.ecommerce.notification.event;

import java.util.concurrent.CompletableFuture;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import com.ecommerce.notification.config.KafkaConfig;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j

public class OrderEventProducer {

    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public void publishOrderPlaced(OrderPlacedEvent event) {
        log.info("Publishing order placed event: {}", event);
        CompletableFuture<SendResult<String, OrderPlacedEvent>> future = kafkaTemplate.send(
                KafkaConfig.ORDER_PLACED_TOPIC,
                event.getOrderNumber(), event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Order placed event published successfully: {}", result);
            } else {
                log.error("Failed to publish order placed event: {}", ex);
            }
        });
    }

}
