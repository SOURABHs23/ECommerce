package com.ecommerce;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import com.ecommerce.config.DotenvConfig;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class ECommerceApplication {

    private static final Logger logger = LoggerFactory.getLogger(ECommerceApplication.class);

    public static void main(String[] args) {
        // Create Spring Application and add .env file loader
        SpringApplication app = new SpringApplication(ECommerceApplication.class);
        app.addInitializers(new DotenvConfig());
        app.run(args);
        logger.info("ECommerce Backend is running on http://localhost:8080");
    }
}
