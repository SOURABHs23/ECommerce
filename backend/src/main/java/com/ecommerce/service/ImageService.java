package com.ecommerce.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for generating real product images using Lorem Picsum.
 * No API key required - works immediately!
 */
@Service
public class ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    /**
     * Generate product images using Lorem Picsum.
     * Each image is unique based on the product name.
     * 
     * @param productName The name of the product (used as seed for consistent
     *                    images)
     * @param count       Number of images to generate
     * @return List of image URLs
     */
    public List<String> fetchProductImages(String productName, int count) {
        List<String> imageUrls = new ArrayList<>();
        int seed = Math.abs(productName.hashCode());

        for (int i = 0; i < count; i++) {
            // Lorem Picsum provides beautiful, random images
            // Using seed ensures same product always gets same images
            String imageUrl = String.format("https://picsum.photos/seed/%d/800/600", seed + i * 100);
            imageUrls.add(imageUrl);
        }

        logger.info("Generated {} images for product: {}", count, productName);
        return imageUrls;
    }

    /**
     * Get a single product image.
     * 
     * @param productName The name of the product
     * @return Image URL
     */
    public String fetchSingleProductImage(String productName) {
        int seed = Math.abs(productName.hashCode());
        return String.format("https://picsum.photos/seed/%d/800/600", seed);
    }

    /**
     * Generate product images with specific dimensions.
     * 
     * @param productName The name of the product
     * @param count       Number of images
     * @param width       Image width
     * @param height      Image height
     * @return List of image URLs
     */
    public List<String> fetchProductImages(String productName, int count, int width, int height) {
        List<String> imageUrls = new ArrayList<>();
        int seed = Math.abs(productName.hashCode());

        for (int i = 0; i < count; i++) {
            String imageUrl = String.format("https://picsum.photos/seed/%d/%d/%d", seed + i * 100, width, height);
            imageUrls.add(imageUrl);
        }

        logger.info("Generated {} images ({}x{}) for product: {}", count, width, height, productName);
        return imageUrls;
    }
}
