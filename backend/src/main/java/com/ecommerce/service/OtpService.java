package com.ecommerce.service;

import com.ecommerce.entity.Otp;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.OtpRepository;
import com.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final SmsService smsService;

    @Value("${otp.expiration.seconds}")
    private int otpExpirationSeconds;

    public OtpService(OtpRepository otpRepository, UserRepository userRepository, SmsService smsService) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.smsService = smsService;
    }

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
        }

        // Save OTP
        Otp otp = new Otp();
        otp.setJwt(jwt);
        otp.setOtp(otpValue);
        otpRepository.save(otp);

        logger.info("OTP generated and saved. Will expire in {} seconds", otpExpirationSeconds);

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

        logger.info("OTP verified successfully for user: {}", user.getEmail());
        return "OTP verified successfully";
    }

    /**
     * Scheduled task to clean up expired OTPs.
     * Runs every minute to remove OTPs older than the configured expiration time.
     */
    @Scheduled(fixedRate = 300000) // Run every 5 minutes (300,000 ms)
    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime expirationTime = LocalDateTime.now().minusSeconds(otpExpirationSeconds);
        int deletedCount = otpRepository.deleteExpiredOtps(expirationTime);
        if (deletedCount > 0) {
            logger.info("Cleaned up {} expired OTPs", deletedCount);
        }
    }
}
