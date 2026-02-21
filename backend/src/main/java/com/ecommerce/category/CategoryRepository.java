package com.ecommerce.category;

import com.ecommerce.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByActiveTrue();

    List<Category> findByParentCategoryIsNullAndActiveTrue();

    boolean existsByName(String name);
}
