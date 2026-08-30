package com.regweb.email;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${resend.from-name}")
    private String fromName;

    @Async
    public void sendRegistrationConfirmation(String toEmail, String recipientName, String eventTitle, String token, String slotLabel, LocalDate slotDate, String slotTime) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("re_defaultkey") || apiKey.equals("mock_key")) {
            log.warn("Resend API key is not configured. Skipping confirmation email delivery.");
            return;
        }

        try {
            Resend resend = new Resend(apiKey);
            
            String from = fromName + " <" + fromEmail + ">";
            String subject = "Registration Confirmed — " + eventTitle;
            
            String htmlBody = buildHtmlBody(recipientName, eventTitle, token, slotLabel, slotDate, slotTime);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(from)
                    .to(toEmail)
                    .subject(subject)
                    .html(htmlBody)
                    .build();

            resend.emails().send(params);
            log.info("Successfully sent registration confirmation email via Resend to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to deliver confirmation email via Resend to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    private String buildHtmlBody(String name, String eventTitle, String token, String slotLabel, LocalDate slotDate, String slotTime) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">");
        sb.append("<h2 style=\"color: #2563eb; margin-bottom: 8px;\">Registration Confirmed!</h2>");
        sb.append("<p style=\"color: #374151; font-size: 16px;\">Hi ").append(name).append(",</p>");
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
