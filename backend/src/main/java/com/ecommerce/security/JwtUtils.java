package com.ecommerce.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Utility class for JWT token extraction from HTTP requests.
 * Centralizes the logic for extracting JWT from Authorization header or
 * cookies.
 */
@Component
public class JwtUtils {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTH_COOKIE_NAME = "auth_token";

    /**
     * Extracts JWT token from the HTTP request.
     * First checks Authorization header, then falls back to cookie.
     *
     * @param request the HTTP servlet request
     * @return the JWT token or null if not found
     */
    public String extractJwtFromRequest(HttpServletRequest request) {
        // Try Authorization header first
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }

        // Fallback to cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (AUTH_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}
