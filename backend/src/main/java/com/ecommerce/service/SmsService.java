package com.ecommerce.service;

import java.util.List;

public interface SmsService {
    boolean sendSms(List<Long> mobiles, Integer otp);
}
