package com.ecommerce.notification;

import java.util.List;

public interface OtpService {
    Integer generateOtp();

    String sendSms(List<Long> mobiles, String jwt);

    String verifyOtp(String otpValue, String jwt);
}
