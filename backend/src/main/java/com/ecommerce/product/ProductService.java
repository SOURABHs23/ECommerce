package com.ecommerce.product;

import com.ecommerce.product.ProductRequest;
import com.ecommerce.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    Page<ProductResponse> getAllProducts(Pageable pageable);

    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    Page<ProductResponse> searchProducts(String query, Pageable pageable);

    Page<ProductResponse> filterProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    List<ProductResponse> getFeaturedProducts();

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    ProductResponse updateStock(Long id, Integer quantity);
}
