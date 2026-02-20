package com.ecommerce.service;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Service for managing HTTP cookies.
 * Extracted from AuthController to follow Single Responsibility Principle.
 */
public interface CookieService {
    void addAuthCookie(HttpServletResponse response, String token);
}
