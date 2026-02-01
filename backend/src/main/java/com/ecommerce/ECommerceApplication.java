package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import com.ecommerce.config.DotenvConfig;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class ECommerceApplication {

    public static void main(String[] args) {
        // Create Spring Application and add .env file loader
        SpringApplication app = new SpringApplication(ECommerceApplication.class);
        app.addInitializers(new DotenvConfig());
        app.run(args);
        System.out.println("ECommerce Backend is running on http://localhost:8080");
    }
}
