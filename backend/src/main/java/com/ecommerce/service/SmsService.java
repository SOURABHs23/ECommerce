package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SmsService {

    @Value("${sms.api.key}")
    private String apiKey;

    @Value("${sms.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendSms(List<Long> mobiles, Integer otp) {
        try {
            String mobileNumbers = mobiles.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));

            String url = String.format(
                    "%s?authorization=%s&variables_values=%d&route=otp&numbers=%s",
                    apiUrl, apiKey, otp, mobileNumbers);

            String response = restTemplate.getForObject(url, String.class);
            System.out.println("SMS Response: " + response);

            return true;
        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
            return false;
        }
    }
}
