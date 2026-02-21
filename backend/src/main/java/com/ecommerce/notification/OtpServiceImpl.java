package com.ecommerce.notification;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.user.User;
import com.ecommerce.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.security.SecureRandom;

@Service
public class OtpServiceImpl implements OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpServiceImpl.class);
    private static final SecureRandom secureRandom = new SecureRandom();

    private final OtpRepository otpRepository;
    private final UserService userService;
    private final SmsService smsService;

    @Value("${otp.expiration.seconds}")
    private int otpExpirationSeconds;

    public OtpServiceImpl(OtpRepository otpRepository, UserService userService, SmsService smsService) {
        this.otpRepository = otpRepository;
        this.userService = userService;
        this.smsService = smsService;
    }

    @Override
    public Integer generateOtp() {
        return 1000 + secureRandom.nextInt(9000);
    }

    @Override
    public String sendSms(List<Long> mobiles, String jwt) {
        Integer otpValue = generateOtp();

        if (mobiles == null || mobiles.isEmpty()) {
            User user = userService.findBySessionToken(jwt)
                    .orElseThrow(() -> new BadRequestException("User not found"));
            mobiles = List.of(user.getMobile());
        }

        Otp otp = new Otp();
        otp.setJwt(jwt);
        otp.setOtp(otpValue);
        otpRepository.save(otp);

        logger.info("OTP generated and saved. Will expire in {} seconds", otpExpirationSeconds);

        boolean success = smsService.sendSms(mobiles, otpValue);
        if (!success) {
            throw new BadRequestException("Error sending SMS");
        }

        return "OTP sent successfully";
    }

    @Override
    @Transactional
    public String verifyOtp(String otpValue, String jwt) {
        Otp otp = otpRepository.findByJwt(jwt)
                .orElseThrow(() -> new BadRequestException("OTP expired"));

        if (!otp.getOtp().equals(Integer.parseInt(otpValue))) {
            throw new BadRequestException("OTP not matched");
        }

        User user = userService.findBySessionToken(jwt)
                .orElseThrow(() -> new BadRequestException("User not found"));
        user.setVerifyMobile(true);
        userService.save(user);

        otpRepository.deleteByJwt(jwt);

        logger.info("OTP verified successfully for user: {}", user.getEmail());
        return "OTP verified successfully";
    }
}
