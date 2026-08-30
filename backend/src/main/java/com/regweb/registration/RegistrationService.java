package com.regweb.registration;

import com.regweb.allocation.*;
import com.regweb.common.CapacityExceededException;
import com.regweb.common.FieldType;
import com.regweb.common.RegistrationClosedException;
import com.regweb.common.RegistrationStatus;
import com.regweb.common.ResourceNotFoundException;
import com.regweb.email.EmailService;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.form.FormField;
import com.regweb.form.FormFieldRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final FormFieldRepository formFieldRepository;
    private final AllocationConfigRepository allocationConfigRepository;
    private final AllocationSlotRepository allocationSlotRepository;
    private final EmailService emailService;

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               FormFieldRepository formFieldRepository,
                               AllocationConfigRepository allocationConfigRepository,
                               AllocationSlotRepository allocationSlotRepository,
                               EmailService emailService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.formFieldRepository = formFieldRepository;
        this.allocationConfigRepository = allocationConfigRepository;
        this.allocationSlotRepository = allocationSlotRepository;
        this.emailService = emailService;
    }

    @Transactional
    public RegistrationResponse registerPublicUser(String slug, RegistrationRequest request) {
        Event event = eventRepository.findBySlugForUpdate(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Status is the single gate — PUBLISHED means admin allows registrations.
        if (event.getStatus() != com.regweb.common.EventStatus.PUBLISHED) {
            throw new RegistrationClosedException("Registration is not active for this event");
        }

        Map<String, Object> formData = request.getFormData();
        List<FormField> fields = formFieldRepository.findByEventIdOrderByDisplayOrderAsc(event.getId());
        // 2. Validate submitted answers against fields configuration
        validateFormData(fields, formData);

        for (FormField f : fields) {
            Object val = formData.get(f.getFieldKey());
            if (Boolean.TRUE.equals(f.getIsUnique()) && val != null && !val.toString().trim().isEmpty()) {
                String strVal = val.toString().trim();
                List<Registration> existingRegs = registrationRepository.findByEventIdAndDeletedAtIsNull(event.getId());
                for (Registration exReg : existingRegs) {
                    Object exVal = exReg.getFormData() != null ? exReg.getFormData().get(f.getFieldKey()) : null;
                    if (exVal != null && exVal.toString().trim().equalsIgnoreCase(strVal)) {
                        throw new IllegalArgumentException("The value for '" + f.getLabel() + "' must be unique. '" + strVal + "' is already registered.");
                    }
                }
            }
        }

        // 3. Extract denormalized fields
        String extractedEmail = null;
        String extractedMobile = null;
        String extractedName = null;

        for (FormField f : fields) {
            Object val = formData.get(f.getFieldKey());
            if (val != null) {
                if (f.getFieldType() == FieldType.EMAIL) {
                    extractedEmail = val.toString();
                } else if (f.getFieldType() == FieldType.MOBILE) {
                    extractedMobile = val.toString();
                } else if (f.getFieldType() == FieldType.TEXT && (extractedName == null || f.getLabel().toLowerCase().contains("name"))) {
                    extractedName = val.toString();
                }
            }
        }

        if (extractedName == null) {
            extractedName = "Anonymous";
        }

        AllocationSlot allocatedSlot = null;

        // 4. Perform capacity increment / slot allocation
        if (event.getAllocationEnabled()) {
            AllocationConfig config = allocationConfigRepository.findByEventId(event.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Allocation settings not configured for this event"));

            // Pessimistic Write Lock on Slots
            List<AllocationSlot> availableSlots = allocationSlotRepository.findAvailableSlotsForUpdate(config.getId(), PageRequest.of(0, 1));
            if (availableSlots.isEmpty()) {
                throw new CapacityExceededException("All available seat slots are fully booked");
            }

            allocatedSlot = availableSlots.get(0);
            allocatedSlot.setFilledCount(allocatedSlot.getFilledCount() + 1);
            allocationSlotRepository.save(allocatedSlot);

            event.setRegisteredCount(event.getRegisteredCount() + 1);
            eventRepository.save(event);
        } else {
            // General event capacity check
            if (event.getRegisteredCount() >= event.getTotalCapacity()) {
                throw new CapacityExceededException("Event registration capacity has been reached");
            }
            event.setRegisteredCount(event.getRegisteredCount() + 1);
            eventRepository.save(event);
        }

        // 5. Generate unique registration token
        String token = generateUniqueToken();

        // 6. Save registration
        Registration reg = new Registration();
        reg.setEvent(event);
        reg.setToken(token);
        reg.setFormData(formData);
        reg.setAllocatedSlot(allocatedSlot);
        reg.setEmail(extractedEmail);
        reg.setMobile(extractedMobile);
        reg.setName(extractedName);
        reg.setCheckedIn(false);

        Registration saved = registrationRepository.save(reg);

        // 7. Async send email confirmation
        if (extractedEmail != null) {
            emailService.sendRegistrationConfirmation(
                    extractedEmail,
                    extractedName,
                    event.getTitle(),
                    token,
                    allocatedSlot != null ? allocatedSlot.getLabel() : null,
                    allocatedSlot != null ? allocatedSlot.getSlotDate() : null,
                    allocatedSlot != null ? allocatedSlot.getSlotTime() : null
            );
        }

        return new RegistrationResponse(
                saved.getId(),
                saved.getToken(),
                allocatedSlot != null ? allocatedSlot.getLabel() : null,
                allocatedSlot != null ? allocatedSlot.getSlotDate() : null,
                allocatedSlot != null ? allocatedSlot.getSlotTime() : null,
                event.getTitle()
        );
    }

    private void validateFormData(List<FormField> fields, Map<String, Object> formData) {
        for (FormField f : fields) {
            Object val = formData.get(f.getFieldKey());
            
            // Required check
            if (f.getRequired()) {
                if (val == null || val.toString().trim().isEmpty()) {
                    throw new IllegalArgumentException("Question '" + f.getLabel() + "' is required");
                }
            }

            if (val != null && !val.toString().trim().isEmpty()) {
                String strVal = val.toString().trim();
                
                // Format check
                if (f.getFieldType() == FieldType.EMAIL) {
                    if (!strVal.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                        throw new IllegalArgumentException("Invalid email format for '" + f.getLabel() + "'");
                    }
                } else if (f.getFieldType() == FieldType.NUMBER) {
                    try {
                        Double.parseDouble(strVal);
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Question '" + f.getLabel() + "' must be a valid number");
                    }
                }
            }
        }
    }
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<AdminRegistrationResponse> searchRegistrations(
            UUID eventId, RegistrationStatus status, UUID slotId, String search, org.springframework.data.domain.Pageable pageable) {
        return registrationRepository.searchRegistrations(eventId, status, slotId, search, pageable)
                .map(AdminRegistrationResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public AdminRegistrationResponse getRegistrationById(UUID id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
        return AdminRegistrationResponse.fromEntity(reg);
    }

    @Transactional
    public void softDeleteRegistration(UUID id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (reg.getDeletedAt() != null) {
            return; // already deleted
        }

        reg.setDeletedAt(Instant.now());
        registrationRepository.save(reg);

        // Decrement Event registeredCount
        Event event = reg.getEvent();
        if (event.getRegisteredCount() > 0) {
            event.setRegisteredCount(event.getRegisteredCount() - 1);
            eventRepository.save(event);
        }

        // Decrement slot filledCount if allocated
        if (reg.getAllocatedSlot() != null) {
            AllocationSlot slot = reg.getAllocatedSlot();
            if (slot.getFilledCount() > 0) {
                slot.setFilledCount(slot.getFilledCount() - 1);
                allocationSlotRepository.save(slot);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<AdminRegistrationResponse> searchCheckInCandidates(UUID eventId, String search) {
        return registrationRepository.searchCheckInCandidates(eventId, search)
                .stream()
                .map(AdminRegistrationResponse::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public AdminRegistrationResponse checkInAttendee(UUID registrationId) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        reg.setCheckedIn(true);
        reg.setCheckedInAt(Instant.now());
        reg.setStatus(RegistrationStatus.CHECKED_IN);
        
        Registration saved = registrationRepository.save(reg);
        return AdminRegistrationResponse.fromEntity(saved);
    }

    private String generateUniqueToken() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random rnd = new Random();
        for (int attempt = 0; attempt < 3; attempt++) {
            StringBuilder sb = new StringBuilder(8);
            for (int i = 0; i < 8; i++) {
                sb.append(chars.charAt(rnd.nextInt(chars.length())));
            }
            String token = sb.toString();
            if (registrationRepository.findByTokenAndDeletedAtIsNull(token).isEmpty()) {
                return token;
            }
        }
        throw new IllegalStateException("Could not generate a unique token after 3 attempts");
    }

    @Transactional(readOnly = true)
    public boolean checkUniqueAnswer(String slug, String fieldKey, String value) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        List<Registration> registrations = registrationRepository.findByEventIdAndDeletedAtIsNull(event.getId());
        for (Registration reg : registrations) {
            if (reg.getFormData() != null) {
                Object exVal = reg.getFormData().get(fieldKey);
                if (exVal != null && exVal.toString().trim().equalsIgnoreCase(value.trim())) {
                    return false;
                }
            }
        }
        return true;
    }
}
