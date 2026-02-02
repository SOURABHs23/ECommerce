package com.ecommerce.dto.response;

import com.ecommerce.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Long parentCategoryId;
    private String parentCategoryName;
    private List<CategoryResponse> subCategories;
    private int productCount;

    public static CategoryResponse fromEntity(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setImageUrl(category.getImageUrl());

        if (category.getParentCategory() != null) {
            response.setParentCategoryId(category.getParentCategory().getId());
            response.setParentCategoryName(category.getParentCategory().getName());
        }

        if (category.getProducts() != null) {
            response.setProductCount(category.getProducts().size());
        }

        return response;
    }

    public static CategoryResponse fromEntityWithSubCategories(Category category) {
        CategoryResponse response = fromEntity(category);

        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            response.setSubCategories(
                    category.getSubCategories().stream()
                            .filter(Category::getActive)
                            .map(CategoryResponse::fromEntity)
                            .collect(Collectors.toList()));
        }

        return response;
    }
}
