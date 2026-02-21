package com.ecommerce.auth;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.user.User;
import com.ecommerce.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AuthResponse signup(SignUpRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setRole("ROLE_USER");
        user = userService.save(user);

        String token = jwtTokenProvider.generateToken(
                String.valueOf(user.getId()), user.getEmail(), user.getRole());
        user.setSessionToken(token);
        userService.save(user);

        logger.info("User signed up: {}", user.getEmail());
        return new AuthResponse(true, "Signup successful", token);
    }

    @Override
    public AuthResponse signin(SignInRequest request) {
        User user = userService.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(
                String.valueOf(user.getId()), user.getEmail(), user.getRole());
        user.setSessionToken(token);
        userService.save(user);

        logger.info("User signed in: {}", user.getEmail());
        return new AuthResponse(true, "Signin successful", token);
    }
}
