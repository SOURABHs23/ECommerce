package com.ecommerce.service;

import java.util.List;

public interface OtpService {
    Integer generateOtp();

    String sendSms(List<Long> mobiles, String jwt);

    String verifyOtp(String otpValue, String jwt);
}
