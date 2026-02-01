package com.ecommerce.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
        logger.info("Twilio initialized successfully");
    }

    public boolean sendSms(List<Long> mobiles, Integer otp) {
        try {
            String messageBody = String.format("Your OTP code is: %d. Valid for 30 seconds.", otp);

            for (Long mobile : mobiles) {
                String toPhoneNumber = formatPhoneNumber(mobile);

                Message message = Message.creator(
                        new PhoneNumber(toPhoneNumber),
                        new PhoneNumber(fromPhoneNumber),
                        messageBody).create();

                logger.info("SMS sent successfully! SID: {}", message.getSid());
            }

            return true;
        } catch (Exception e) {
            logger.error("Error sending SMS via Twilio: {}", e.getMessage(), e);
            return false;
        }
    }

    private String formatPhoneNumber(Long mobile) {
        String phoneNumber = mobile.toString();

        // If number doesn't start with +, assume it's an Indian number and add +91
        if (!phoneNumber.startsWith("+")) {
            phoneNumber = "+91" + phoneNumber;
        }

        return phoneNumber;
    }
}
