package com.ecommerce.auth;

import com.ecommerce.auth.SignInRequest;
import com.ecommerce.auth.SignUpRequest;
import com.ecommerce.auth.AuthResponse;

public interface AuthService {
    AuthResponse signup(SignUpRequest request);

    AuthResponse signin(SignInRequest request);
}
