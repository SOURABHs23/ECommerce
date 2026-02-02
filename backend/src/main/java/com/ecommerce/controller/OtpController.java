package com.ecommerce.controller;

import com.ecommerce.dto.request.SendEmailRequest;
import com.ecommerce.dto.request.SendSmsRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private static final Logger logger = LoggerFactory.getLogger(OtpController.class);

    private final EmailService emailService;
    private final OtpService otpService;

    public OtpController(EmailService emailService, OtpService otpService) {
        this.emailService = emailService;
        this.otpService = otpService;
    }

    @PostMapping("/send-email")
    public ResponseEntity<ApiResponse> sendEmail(@Valid @RequestBody SendEmailRequest request) {
        logger.info("Sending email to {} recipients", request.getEmails().size());
        emailService.sendEmail(request.getEmails(), request.getSubject(), request.getMessage());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("recipients", request.getEmails());
        responseData.put("subject", request.getSubject());
        responseData.put("sentAt", LocalDateTime.now());

        return ResponseEntity.ok(new ApiResponse(true, "Email sent successfully", responseData));
    }

    @PostMapping("/send-sms")
    public ResponseEntity<ApiResponse> sendSms(@RequestBody SendSmsRequest request,
            HttpServletRequest httpRequest) {
        String jwt = JwtUtils.extractJwtFromRequest(httpRequest);
        logger.info("Sending SMS OTP request");
        String message = otpService.sendSms(request.getMobiles(), jwt);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("mobiles", request.getMobiles());
        responseData.put("sentAt", LocalDateTime.now());

        return ResponseEntity.ok(new ApiResponse(true, message, responseData));
    }

    @GetMapping("/verify/{otp}")
    public ResponseEntity<ApiResponse> verifyOtp(@PathVariable String otp,
            HttpServletRequest httpRequest) {
        String jwt = JwtUtils.extractJwtFromRequest(httpRequest);
        logger.info("Verifying OTP");
        String message = otpService.verifyOtp(otp, jwt);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("verified", true);
        responseData.put("verifiedAt", LocalDateTime.now());

        return ResponseEntity.ok(new ApiResponse(true, message, responseData));
    }
}
