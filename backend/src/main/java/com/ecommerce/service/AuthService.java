package com.ecommerce.service;

import com.ecommerce.dto.request.SignInRequest;
import com.ecommerce.dto.request.SignUpRequest;
import com.ecommerce.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse signup(SignUpRequest request);

    AuthResponse signin(SignInRequest request);
}
