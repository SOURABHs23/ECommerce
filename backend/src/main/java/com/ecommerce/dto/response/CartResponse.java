package com.ecommerce.dto.response;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long id;
    private List<CartItemResponse> items;
    private int totalItems;
    private BigDecimal totalAmount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;
        private Boolean inStock;
    }

    public static CartResponse fromEntity(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());

        if (cart.getItems() != null) {
            response.setItems(
                    cart.getItems().stream()
                            .map(CartResponse::mapCartItem)
                            .collect(Collectors.toList()));
            response.setTotalItems(cart.getItems().stream()
                    .mapToInt(CartItem::getQuantity)
                    .sum());
            response.setTotalAmount(cart.getItems().stream()
                    .map(item -> item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
        } else {
            response.setTotalItems(0);
            response.setTotalAmount(BigDecimal.ZERO);
        }

        return response;
    }

    private static CartItemResponse mapCartItem(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());
        response.setPrice(item.getProduct().getPrice());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity())));
        response.setInStock(item.getProduct().getStock() >= item.getQuantity());

        if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
            response.setProductImage(item.getProduct().getImages().get(0).getImageUrl());
        }

        return response;
    }
}
