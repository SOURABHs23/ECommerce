package com.ecommerce.controller;

import com.ecommerce.dto.request.SignInRequest;
import com.ecommerce.dto.request.SignUpRequest;
import com.ecommerce.dto.response.AuthResponse;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.CookieService;
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
