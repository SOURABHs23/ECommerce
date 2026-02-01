package com.ecommerce.service;

import com.ecommerce.entity.Otp;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.OtpRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SmsService smsService;

    @Value("${otp.expiration.seconds}")
    private int otpExpirationSeconds;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public Integer generateOtp() {
        Random random = new Random();
        return 1000 + random.nextInt(9000); // Generates 4-digit OTP
    }

    public String sendSms(List<Long> mobiles, String jwt) {
        Integer otpValue = generateOtp();

        // If mobiles list is empty, get mobile from authenticated user
        if (mobiles == null || mobiles.isEmpty()) {
            User user = userRepository.findBySessionToken(jwt)
                    .orElseThrow(() -> new BadRequestException("User not found"));
            mobiles = List.of(user.getMobile());

            // Save OTP
            Otp otp = new Otp();
            otp.setJwt(jwt);
            otp.setOtp(otpValue);
            otpRepository.save(otp);

            // Schedule deletion after expiration
            scheduleOtpDeletion(jwt);
        }

        // Send SMS
        boolean success = smsService.sendSms(mobiles, otpValue);
        if (!success) {
            throw new BadRequestException("Error sending SMS");
        }

        return "OTP sent successfully";
    }

    @Transactional
    public String verifyOtp(String otpValue, String jwt) {
        Otp otp = otpRepository.findByJwt(jwt)
                .orElseThrow(() -> new BadRequestException("OTP expired"));

        if (!otp.getOtp().equals(Integer.parseInt(otpValue))) {
            throw new BadRequestException("OTP not matched");
        }

        // Update user's verifyMobile status
        User user = userRepository.findBySessionToken(jwt)
                .orElseThrow(() -> new BadRequestException("User not found"));
        user.setVerifyMobile(true);
        userRepository.save(user);

        // Delete OTP
        otpRepository.deleteByJwt(jwt);

        return "OTP verified successfully";
    }

    @Async
    protected void scheduleOtpDeletion(String jwt) {
        scheduler.schedule(() -> {
            try {
                otpRepository.deleteByJwt(jwt);
            } catch (Exception e) {
                // Log error
                System.err.println("Error deleting OTP: " + e.getMessage());
            }
        }, otpExpirationSeconds, TimeUnit.SECONDS);
    }
}
