package com.ecommerce.common.security;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Service for managing HTTP authentication cookies.
 */
public interface CookieService {
    void addAuthCookie(HttpServletResponse response, String token);
}
