package com.regweb.export;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.regweb.common.ResourceNotFoundException;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.registration.Registration;
import com.regweb.registration.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExportService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public ExportService(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Transactional(readOnly = true)
    public String exportRegistrationsToCsv(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Registration> registrations = registrationRepository.findByEventIdAndDeletedAtIsNull(eventId);

        StringWriter sw = new StringWriter();
        // Header
        sw.append("Token,Name,Email,Mobile,Status,Checked In,Checked In At,Slot Label,Custom Answers\n");

        for (Registration reg : registrations) {
            sw.append(escapeCsv(reg.getToken())).append(",")
              .append(escapeCsv(reg.getName())).append(",")
              .append(escapeCsv(reg.getEmail())).append(",")
              .append(escapeCsv(reg.getMobile())).append(",")
              .append(escapeCsv(reg.getStatus().name())).append(",")
              .append(escapeCsv(reg.getCheckedIn() ? "Yes" : "No")).append(",")
              .append(escapeCsv(reg.getCheckedInAt() != null ? reg.getCheckedInAt().toString() : "")).append(",")
              .append(escapeCsv(reg.getAllocatedSlot() != null ? reg.getAllocatedSlot().getLabel() : "")).append(",")
              .append(escapeCsv(formatAnswers(reg.getFormData())))
              .append("\n");
        }

        return sw.toString();
    }

    @Transactional(readOnly = true)
    public byte[] exportRegistrationsToPdf(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Registration> registrations = registrationRepository.findByEventIdAndDeletedAtIsNull(eventId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Header
        document.add(new Paragraph("Registrations Report").setFontSize(20).setBold());
        document.add(new Paragraph("Event: " + event.getTitle()).setFontSize(14));
        document.add(new Paragraph("Total Capacity: " + event.getTotalCapacity() + " | Registered: " + event.getRegisteredCount()).setFontSize(11));
        document.add(new Paragraph("\n"));

        float[] columnWidths = {2, 3, 3, 2, 2, 2};
        Table table = new Table(UnitValue.createPercentArray(columnWidths));
        table.setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell("Token");
        table.addHeaderCell("Name");
        table.addHeaderCell("Email");
        table.addHeaderCell("Slot");
        table.addHeaderCell("Status");
        table.addHeaderCell("Checked In");

        for (Registration reg : registrations) {
            table.addCell(reg.getToken());
            table.addCell(reg.getName() != null ? reg.getName() : "Anonymous");
            table.addCell(reg.getEmail() != null ? reg.getEmail() : "");
            table.addCell(reg.getAllocatedSlot() != null ? reg.getAllocatedSlot().getLabel() : "—");
            table.addCell(reg.getStatus() != null ? reg.getStatus().name() : "");
            table.addCell(reg.getCheckedIn() ? "Yes" : "No");
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String clean = value.replace("\"", "\"\"");
        if (clean.contains(",") || clean.contains("\n") || clean.contains("\"")) {
            return "\"" + clean + "\"";
        }
        return clean;
    }

    private String formatAnswers(Map<String, Object> answers) {
        if (answers == null || answers.isEmpty()) {
            return "";
        }
        return answers.entrySet().stream()
                .map(e -> e.getKey() + ": " + (e.getValue() != null ? e.getValue().toString() : ""))
                .collect(Collectors.joining(" | "));
    }
}
