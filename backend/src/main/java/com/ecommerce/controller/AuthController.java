package com.ecommerce.controller;

import com.ecommerce.dto.request.SignInRequest;
import com.ecommerce.dto.request.SignUpRequest;
import com.ecommerce.dto.response.AuthResponse;
import com.ecommerce.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@Valid @RequestBody SignInRequest request,
            HttpServletResponse httpResponse) {
        AuthResponse response = authService.signin(request);

        // Set cookie for backward compatibility
        if (response.getToken() != null) {
            Cookie cookie = new Cookie("auth_token", response.getToken());
            cookie.setHttpOnly(true);
            cookie.setMaxAge(3600); // 1 hour
            cookie.setPath("/");
            httpResponse.addCookie(cookie);
        }

        return ResponseEntity.ok(response);
    }
}
