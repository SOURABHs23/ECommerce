package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    private String notes;

    private String paymentMethod = "COD"; // Cash on Delivery default
}
