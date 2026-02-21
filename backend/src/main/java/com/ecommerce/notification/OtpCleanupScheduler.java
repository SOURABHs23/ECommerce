package com.ecommerce.notification;

import com.ecommerce.notification.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Scheduled task to clean up expired OTPs.
 * Extracted from OtpService to follow Single Responsibility Principle.
 */
@Component
public class OtpCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(OtpCleanupScheduler.class);

    private final OtpRepository otpRepository;

    @Value("${otp.expiration.seconds}")
    private int otpExpirationSeconds;

    public OtpCleanupScheduler(OtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    /**
     * Runs every 5 minutes to remove OTPs older than the configured expiration
     * time.
     */
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime expirationTime = LocalDateTime.now().minusSeconds(otpExpirationSeconds);
        int deletedCount = otpRepository.deleteExpiredOtps(expirationTime);
        if (deletedCount > 0) {
            logger.info("Cleaned up {} expired OTPs", deletedCount);
        }
    }
}
