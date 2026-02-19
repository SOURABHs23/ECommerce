package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/home")
    public ResponseEntity<ApiResponse> home(@AuthenticationPrincipal User user) {
        String message = "Welcome " + user.getFirstname() + " " + user.getLastname();
        Map<String, Object> userData = Map.of(
                "id", user.getId(),
                "firstname", user.getFirstname(),
                "lastname", user.getLastname(),
                "email", user.getEmail());
        return ResponseEntity.ok(new ApiResponse(true, message, userData));
    }
}
