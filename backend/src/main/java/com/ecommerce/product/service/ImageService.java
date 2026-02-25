package com.ecommerce.product.service;

import java.util.List;

public interface ImageService {
    List<String> fetchProductImages(String productName, int count);
}
