package com.ecommerce.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
    }

    public boolean sendSms(List<Long> mobiles, Integer otp) {
        try {
            String messageBody = String.format("Your OTP code is: %d. Valid for 30 seconds.", otp);

            for (Long mobile : mobiles) {
                // Format mobile number with country code if not present
                String toPhoneNumber = formatPhoneNumber(mobile);

                Message message = Message.creator(
                        new PhoneNumber(toPhoneNumber), // To
                        new PhoneNumber(fromPhoneNumber), // From
                        messageBody).create();

                System.out.println("SMS sent successfully! SID: " + message.getSid());
            }

            return true;
        } catch (Exception e) {
            System.err.println("Error sending SMS via Twilio: " + e.getMessage());
            e.printStackTrace();
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
