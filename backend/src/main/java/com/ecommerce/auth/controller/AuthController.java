package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.SignInRequest;
import com.ecommerce.auth.dto.SignUpRequest;
import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.service.AuthService;
import com.ecommerce.common.security.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
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

        if (response.getToken() != null) {
            cookieService.addAuthCookie(httpResponse, response.getToken());
        }

        return ResponseEntity.ok(response);
    }
}
