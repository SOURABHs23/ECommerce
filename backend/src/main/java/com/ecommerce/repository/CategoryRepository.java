package com.ecommerce.repository;

import com.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByActiveTrue();

    List<Category> findByParentCategoryIsNullAndActiveTrue();

    List<Category> findByParentCategoryIdAndActiveTrue(Long parentId);

    boolean existsByName(String name);

    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.name")
    List<Category> findAllActiveOrderByName();
}
