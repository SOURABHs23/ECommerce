package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.SignInRequest;
import com.ecommerce.auth.dto.SignUpRequest;
import com.ecommerce.auth.dto.AuthResponse;

public interface AuthService {
    AuthResponse signup(SignUpRequest request);

    AuthResponse signin(SignInRequest request);
}
