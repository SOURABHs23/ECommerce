package com.ecommerce.auth;

import com.ecommerce.auth.SignInRequest;
import com.ecommerce.auth.SignUpRequest;
import com.ecommerce.auth.AuthResponse;
import com.ecommerce.user.User;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.user.UserRepository;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.auth.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AuthResponse signup(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User already there with this emailID");
        }

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setVerifyEmail(false);
        user.setVerifyMobile(false);

        userRepository.save(user);

        logger.info("New user registered: {}", request.getEmail());
        return new AuthResponse(true, "Signup successfully", null);
    }

    @Override
    public AuthResponse signin(SignInRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not there with this emailID"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Failed login attempt for user: {}", request.getEmail());
            throw new BadRequestException("Password and email not matching");
        }

        String token = jwtTokenProvider.generateToken(user.getId().toString(), user.getEmail(), user.getRole());

        user.setSessionToken(token);
        userRepository.save(user);

        logger.info("User logged in: {}", request.getEmail());
        return new AuthResponse(true, "User logged in", token);
    }
}
