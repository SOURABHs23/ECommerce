package com.ecommerce.service.impl;

import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendOrderConfirmation(String to, String orderNumber, Object orderDetails) {
        try {
            logger.info("Sending order confirmation email to: {}", to);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Order Confirmation - " + orderNumber);

            String htmlContent = buildOrderEmailContent(orderNumber, (OrderResponse) orderDetails);
            helper.setText(htmlContent, true); // true = html

            mailSender.send(message);
            logger.info("Order confirmation email sent successfully to: {}", to);

        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendEmail(java.util.List<String> recipients, String subject, String content) {
        for (String to : recipients) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(content, true);

                mailSender.send(message);
                logger.info("Email sent successfully to: {}", to);
            } catch (MessagingException e) {
                logger.error("Failed to send email to {}: {}", to, e.getMessage());
            }
        }
    }

    private String buildOrderEmailContent(String orderNumber, OrderResponse order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h1>Thank you for your order!</h1>");
        sb.append("<p>Your order number is: <strong>").append(orderNumber).append("</strong></p>");
        sb.append("<p>Total Amount: $").append(order.getTotalAmount()).append("</p>");
        sb.append("<h3>Order Items:</h3>");
        sb.append("<ul>");

        if (order.getItems() != null) {
            order.getItems().forEach(item -> {
                sb.append("<li>")
                        .append(item.getProductName())
                        .append(" x ").append(item.getQuantity())
                        .append(" - $").append(item.getSubtotal())
                        .append("</li>");
            });
        }

        sb.append("</ul>");
        sb.append("<p>We will notify you when your items are shipped.</p>");
        sb.append("</body></html>");
        return sb.toString();
    }
}
