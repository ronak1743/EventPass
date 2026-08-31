package com.regweb.export;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.regweb.common.ResourceNotFoundException;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.form.FormField;
import com.regweb.form.FormFieldRepository;
import com.regweb.registration.Registration;
import com.regweb.registration.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExportService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final FormFieldRepository formFieldRepository;

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault());

    public ExportService(EventRepository eventRepository,
                         RegistrationRepository registrationRepository,
                         FormFieldRepository formFieldRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.formFieldRepository = formFieldRepository;
    }

    @Transactional(readOnly = true)
    public String exportRegistrationsToCsv(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Registration> registrations = registrationRepository.findByEventIdAndDeletedAtIsNull(eventId);
        List<FormField> fields = formFieldRepository.findByEventIdOrderByDisplayOrderAsc(eventId);

        StringWriter sw = new StringWriter();

        // Build CSV Header
        List<String> headers = new ArrayList<>();
        headers.add("Token");

        if (!fields.isEmpty()) {
            for (FormField f : fields) {
                headers.add(f.getLabel());
            }
        } else {
            headers.add("Name");
            headers.add("Email");
            headers.add("Mobile");
        }

        headers.add("Slot / Schedule");
        headers.add("Status");
        headers.add("Checked In");
        headers.add("Checked In At");

        sw.append(headers.stream().map(this::escapeCsv).collect(Collectors.joining(","))).append("\n");

        for (Registration reg : registrations) {
            List<String> row = new ArrayList<>();
            row.add(reg.getToken());

            Map<String, Object> formData = reg.getFormData() != null ? reg.getFormData() : Map.of();

            if (!fields.isEmpty()) {
                for (FormField f : fields) {
                    Object val = formData.get(f.getFieldKey());
                    if (val == null) {
                        if ("name".equalsIgnoreCase(f.getFieldKey()) || "name".equalsIgnoreCase(f.getLabel())) {
                            val = reg.getName();
                        } else if ("email".equalsIgnoreCase(f.getFieldKey()) || "email".equalsIgnoreCase(f.getLabel())) {
                            val = reg.getEmail();
                        } else if ("mobile".equalsIgnoreCase(f.getFieldKey()) || "mobile".equalsIgnoreCase(f.getLabel())) {
                            val = reg.getMobile();
                        }
                    }
                    row.add(formatValue(val));
                }
            } else {
                row.add(reg.getName() != null ? reg.getName() : "");
                row.add(reg.getEmail() != null ? reg.getEmail() : "");
                row.add(reg.getMobile() != null ? reg.getMobile() : "");
            }

            row.add(reg.getAllocatedSlot() != null ? reg.getAllocatedSlot().getLabel() : "");
            row.add(reg.getStatus() != null ? reg.getStatus().name() : "");
            row.add(Boolean.TRUE.equals(reg.getCheckedIn()) ? "Yes" : "No");
            row.add(reg.getCheckedInAt() != null ? DATE_TIME_FORMATTER.format(reg.getCheckedInAt()) : "");

            sw.append(row.stream().map(this::escapeCsv).collect(Collectors.joining(","))).append("\n");
        }

        return sw.toString();
    }

    @Transactional(readOnly = true)
    public byte[] exportRegistrationsToPdf(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Registration> registrations = registrationRepository.findByEventIdAndDeletedAtIsNull(eventId);
        List<FormField> fields = formFieldRepository.findByEventIdOrderByDisplayOrderAsc(eventId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);

        // Landscape mode for better width presentation across multiple dynamic columns
        pdf.setDefaultPageSize(PageSize.A4.rotate());

        Document document = new Document(pdf);
        document.setMargins(20, 20, 20, 20);

        // Header Title
        document.add(new Paragraph("Registrations Report")
                .setFontSize(18)
                .setBold()
                .setFontColor(new DeviceRgb(31, 41, 55)));

        document.add(new Paragraph("Event: " + event.getTitle() + (event.getLocation() != null ? " | Location: " + event.getLocation() : ""))
                .setFontSize(11)
                .setFontColor(new DeviceRgb(75, 85, 99)));

        document.add(new Paragraph("Total Capacity: " + event.getTotalCapacity() + " | Registered: " + registrations.size() + " | Status: " + event.getStatus())
                .setFontSize(10)
                .setFontColor(new DeviceRgb(107, 114, 128)));

        document.add(new Paragraph("\n"));

        // Build Table Headers
        List<String> headers = new ArrayList<>();
        headers.add("Token");

        if (!fields.isEmpty()) {
            for (FormField f : fields) {
                headers.add(f.getLabel());
            }
        } else {
            headers.add("Name");
            headers.add("Email");
            headers.add("Mobile");
        }

        headers.add("Slot");
        headers.add("Status");
        headers.add("Check-In");

        int colCount = headers.size();
        Table table = new Table(UnitValue.createPercentArray(colCount));
        table.setWidth(UnitValue.createPercentValue(100));

        // Header Row Styling
        for (String h : headers) {
            Cell cell = new Cell()
                    .add(new Paragraph(h).setBold().setFontSize(8.5f))
                    .setBackgroundColor(new DeviceRgb(243, 244, 246))
                    .setFontColor(new DeviceRgb(31, 41, 55))
                    .setPadding(6);
            table.addHeaderCell(cell);
        }

        // Data Rows Styling
        for (Registration reg : registrations) {
            Map<String, Object> formData = reg.getFormData() != null ? reg.getFormData() : Map.of();

            // Token
            table.addCell(createBodyCell(reg.getToken()));

            // Dynamic Form Fields
            if (!fields.isEmpty()) {
                for (FormField f : fields) {
                    Object val = formData.get(f.getFieldKey());
                    if (val == null) {
                        if ("name".equalsIgnoreCase(f.getFieldKey()) || "name".equalsIgnoreCase(f.getLabel())) {
                            val = reg.getName();
                        } else if ("email".equalsIgnoreCase(f.getFieldKey()) || "email".equalsIgnoreCase(f.getLabel())) {
                            val = reg.getEmail();
                        } else if ("mobile".equalsIgnoreCase(f.getFieldKey()) || "mobile".equalsIgnoreCase(f.getLabel())) {
                            val = reg.getMobile();
                        }
                    }
                    table.addCell(createBodyCell(formatValue(val)));
                }
            } else {
                table.addCell(createBodyCell(reg.getName() != null ? reg.getName() : "—"));
                table.addCell(createBodyCell(reg.getEmail() != null ? reg.getEmail() : "—"));
                table.addCell(createBodyCell(reg.getMobile() != null ? reg.getMobile() : "—"));
            }

            // Slot
            table.addCell(createBodyCell(reg.getAllocatedSlot() != null ? reg.getAllocatedSlot().getLabel() : "—"));

            // Status
            table.addCell(createBodyCell(reg.getStatus() != null ? reg.getStatus().name() : ""));

            // Check-In
            String checkInText = Boolean.TRUE.equals(reg.getCheckedIn()) ? "Yes" : "No";
            if (Boolean.TRUE.equals(reg.getCheckedIn()) && reg.getCheckedInAt() != null) {
                checkInText += " (" + DATE_TIME_FORMATTER.format(reg.getCheckedInAt()) + ")";
            }
            table.addCell(createBodyCell(checkInText));
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    private Cell createBodyCell(String content) {
        return new Cell()
                .add(new Paragraph(content != null && !content.isEmpty() ? content : "—").setFontSize(8f))
                .setPadding(5)
                .setFontColor(new DeviceRgb(55, 65, 81));
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

    private String formatValue(Object value) {
        if (value == null) {
            return "";
        }
        if (value instanceof List<?> list) {
            return list.stream().map(Object::toString).collect(Collectors.joining(", "));
        }
        if (value instanceof Boolean bool) {
            return bool ? "Yes" : "No";
        }
        return value.toString().trim();
    }
}
