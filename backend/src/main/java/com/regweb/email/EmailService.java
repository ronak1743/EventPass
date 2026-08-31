package com.regweb.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${email.api-key:}")
    private String apiKey;

    @Value("${email.from-email:gondaliyaronak78@gmail.com}")
    private String fromEmail;

    @Value("${email.from-name:EventPass}")
    private String fromName;

    @Value("${email.smtp-host:smtp-relay.brevo.com}")
    private String smtpHost;

    @Value("${email.smtp-port:587}")
    private int smtpPort;

    @Value("${email.smtp-username:}")
    private String smtpUsername;

    @Value("${email.smtp-password:}")
    private String smtpPassword;

    @Async
    public void sendRegistrationConfirmation(String toEmail, String recipientName, String eventTitle, String token, String slotLabel, LocalDate slotDate, String slotTime) {
        String effectiveKey = (apiKey != null && !apiKey.trim().isEmpty()) ? apiKey.trim() : "";
        String effectiveSmtpPass = (smtpPassword != null && !smtpPassword.trim().isEmpty()) ? smtpPassword.trim() : effectiveKey;

        if (effectiveKey.isEmpty() && effectiveSmtpPass.isEmpty()) {
            log.warn("No email API key or SMTP password configured. Skipping confirmation email delivery.");
            return;
        }

        String subject = "Registration Confirmed — " + eventTitle;
        String htmlBody = buildHtmlBody(recipientName, eventTitle, token, slotLabel, slotDate, slotTime);

        try {
            // Option 1: Brevo REST API (xkeysib-...)
            if (effectiveKey.startsWith("xkeysib-")) {
                sendViaBrevoApi(effectiveKey, toEmail, recipientName, subject, htmlBody);
            }
            // Option 2: Brevo SMTP Key (xsmtpsib-...) or Custom SMTP
            else if (effectiveKey.startsWith("xsmtpsib-") || !effectiveSmtpPass.isEmpty()) {
                String username = (smtpUsername != null && !smtpUsername.trim().isEmpty()) ? smtpUsername.trim() : fromEmail;
                sendViaSmtp(username, effectiveSmtpPass, toEmail, recipientName, subject, htmlBody);
            }
            // Option 3: Resend SDK (re_...)
            else if (effectiveKey.startsWith("re_")) {
                sendViaResend(effectiveKey, toEmail, subject, htmlBody);
            } else {
                // Default fallback: Try Brevo API first, then SMTP
                sendViaBrevoApi(effectiveKey, toEmail, recipientName, subject, htmlBody);
            }
        } catch (Exception e) {
            log.error("Failed to deliver confirmation email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    private void sendViaBrevoApi(String key, String toEmail, String recipientName, String subject, String htmlBody) throws Exception {
        Map<String, Object> payload = Map.of(
                "sender", Map.of("name", fromName, "email", fromEmail),
                "to", List.of(Map.of("email", toEmail, "name", recipientName != null ? recipientName : "Attendee")),
                "subject", subject,
                "htmlContent", htmlBody
        );

        String jsonBody = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("accept", "application/json")
                .header("api-key", key)
                .header("content-type", "application/json")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            log.info("Successfully sent registration confirmation email via Brevo REST API to {}", toEmail);
        } else {
            log.error("Brevo REST API error (HTTP {}): {}", response.statusCode(), response.body());
            throw new RuntimeException("Brevo API returned error HTTP " + response.statusCode() + ": " + response.body());
        }
    }

    private void sendViaSmtp(String username, String password, String toEmail, String recipientName, String subject, String htmlBody) throws Exception {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", String.valueOf(smtpPort));
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail, fromName));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject(subject);
        message.setContent(htmlBody, "text/html; charset=utf-8");

        Transport.send(message);
        log.info("Successfully sent registration confirmation email via SMTP to {}", toEmail);
    }

    private void sendViaResend(String key, String toEmail, String subject, String htmlBody) {
        Resend resend = new Resend(key);
        String from = fromName + " <" + fromEmail + ">";

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(from)
                .to(toEmail)
                .subject(subject)
                .html(htmlBody)
                .build();

        resend.emails().send(params);
        log.info("Successfully sent registration confirmation email via Resend to {}", toEmail);
    }

    private String buildHtmlBody(String name, String eventTitle, String token, String slotLabel, LocalDate slotDate, String slotTime) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">");
        sb.append("<h2 style=\"color: #2563eb; margin-bottom: 8px;\">Registration Confirmed!</h2>");
        sb.append("<p style=\"color: #374151; font-size: 16px;\">Hi ").append(name != null ? name : "there").append(",</p>");
        sb.append("<p style=\"color: #374151; font-size: 14px; line-height: 1.5;\">Your registration has been confirmed for the following event:</p>");
        sb.append("<div style=\"background-color: #f3f4f6; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px; font-size: 16px; color: #111827;\">")
          .append(eventTitle)
          .append("</div>");
        
        sb.append("<div style=\"text-align: center; background-color: #eff6ff; border: 1px dashed #bfdbfe; padding: 20px; border-radius: 8px; margin-bottom: 24px;\">");
        sb.append("<div style=\"font-size: 12px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;\">Your Check-In Token</div>");
        sb.append("<div style=\"font-size: 32px; font-weight: 800; color: #1e40af; letter-spacing: 2px; font-family: monospace;\">")
          .append(token)
          .append("</div>");
        sb.append("<p style=\"font-size: 12px; color: #4b5563; margin-top: 8px; margin-bottom: 0;\">Save this token. You will need it to check-in at the entrance.</p>");
        sb.append("</div>");

        if (slotLabel != null) {
            sb.append("<div style=\"background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; margin-bottom: 24px;\">");
            sb.append("<div style=\"font-size: 13px; font-weight: bold; color: #374151; margin-bottom: 6px;\">Allocated Slot Details:</div>");
            sb.append("<div style=\"font-size: 14px; color: #111827;\"><b>Label:</b> ").append(slotLabel).append("</div>");
            if (slotDate != null) {
                sb.append("<div style=\"font-size: 14px; color: #111827; margin-top: 4px;\"><b>Date:</b> ").append(slotDate.toString()).append("</div>");
            }
            if (slotTime != null && !slotTime.trim().isEmpty()) {
                sb.append("<div style=\"font-size: 14px; color: #111827; margin-top: 4px;\"><b>Time Slot:</b> ").append(slotTime).append("</div>");
            }
            sb.append("</div>");
        }

        sb.append("<hr style=\"border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;\">");
        sb.append("<p style=\"font-size: 11px; color: #6b7280; text-align: center; margin: 0;\">This is an automated notification from EventPass registration systems.</p>");
        sb.append("</div>");
        
        return sb.toString();
    }
}
