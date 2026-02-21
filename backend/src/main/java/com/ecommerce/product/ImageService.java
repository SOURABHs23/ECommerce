package com.ecommerce.product;

import java.util.List;

public interface ImageService {
    List<String> fetchProductImages(String productName, int count);
}
