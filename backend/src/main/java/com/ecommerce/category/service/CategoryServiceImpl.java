package com.ecommerce.category.service;

import com.ecommerce.category.dto.CategoryRequest;
import com.ecommerce.category.dto.CategoryResponse;
import com.ecommerce.category.model.Category;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.category.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByActiveTrue().stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getRootCategories() {
        return categoryRepository.findByParentCategoryIsNullAndActiveTrue().stream()
                .map(CategoryResponse::fromEntityWithSubCategories)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return CategoryResponse.fromEntityWithSubCategories(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists with name: " + request.getName());
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        if (request.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParentCategory(parent);
        }

        category = categoryRepository.save(category);
        logger.info("Created category: {}", category.getName());
        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        if (request.getParentCategoryId() != null) {
            if (request.getParentCategoryId().equals(id)) {
                throw new BadRequestException("Category cannot be its own parent");
            }
            Category parent = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        category = categoryRepository.save(category);
        logger.info("Updated category: {}", category.getName());
        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setActive(false);
        categoryRepository.save(category);
        logger.info("Deleted category: {}", category.getName());
    }
}
