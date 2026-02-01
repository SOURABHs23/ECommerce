package com.ecommerce.controller;

import com.ecommerce.dto.request.SendEmailRequest;
import com.ecommerce.dto.request.SendSmsRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.OtpService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/send-email")
    public ResponseEntity<ApiResponse> sendEmail(@Valid @RequestBody SendEmailRequest request) {
        emailService.sendEmail(request.getEmails(), request.getSubject(), request.getMessage());

        // Create response data with email details
        var responseData = new java.util.HashMap<String, Object>();
        responseData.put("recipients", request.getEmails());
        responseData.put("subject", request.getSubject());
        responseData.put("sentAt", java.time.LocalDateTime.now());

        return ResponseEntity.ok(new ApiResponse(true, "Email sent successfully", responseData));
    }

    @PostMapping("/send-sms")
    public ResponseEntity<ApiResponse> sendSms(@RequestBody SendSmsRequest request,
            HttpServletRequest httpRequest) {
        String jwt = getJwtFromRequest(httpRequest);
        String message = otpService.sendSms(request.getMobiles(), jwt);

        // Create response data with mobile numbers
        var responseData = new java.util.HashMap<String, Object>();
        responseData.put("mobiles", request.getMobiles());
        responseData.put("sentAt", java.time.LocalDateTime.now());

        return ResponseEntity.ok(new ApiResponse(true, message, responseData));
    }

    @GetMapping("/verify/{otp}")
    public ResponseEntity<ApiResponse> verifyOtp(@PathVariable String otp,
            HttpServletRequest httpRequest) {
        String jwt = getJwtFromRequest(httpRequest);
        String message = otpService.verifyOtp(otp, jwt);

        // Create response data with verification status
        var responseData = new java.util.HashMap<String, Object>();
        responseData.put("verified", true);
        responseData.put("verifiedAt", java.time.LocalDateTime.now());

        return ResponseEntity.ok(new ApiResponse(true, message, responseData));
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // Try Authorization header first
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        // Fallback to cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}
