package com.ecommerce.dto.response;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private String brand;
    private Long categoryId;
    private String categoryName;
    private List<String> images;
    private Boolean featured;
    private Boolean inStock;

    public static ProductResponse fromEntity(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setSku(product.getSku());
        response.setBrand(product.getBrand());
        response.setFeatured(product.getFeatured());
        response.setInStock(product.getStock() > 0);

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }

        if (product.getImages() != null) {
            response.setImages(
                    product.getImages().stream()
                            .map(ProductImage::getImageUrl)
                            .collect(Collectors.toList()));
        }

        return response;
    }
}
