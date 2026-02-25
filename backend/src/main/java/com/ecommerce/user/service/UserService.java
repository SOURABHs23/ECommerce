package com.ecommerce.user.service;

import com.ecommerce.user.model.User;

import java.util.Optional;

/**
 * Centralizes all User data access.
 * Other domains must call this service instead of using UserRepository
 * directly.
 */
public interface UserService {
    User findById(Long id);

    Optional<User> findOptionalById(Long id);

    User findByEmail(String email);

    boolean existsByEmail(String email);

    User save(User user);

    Optional<User> findBySessionToken(String token);
}
