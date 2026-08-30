package com.regweb.form;

import com.regweb.common.FieldType;
import com.regweb.common.ResourceNotFoundException;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FormFieldService {

    private final FormFieldRepository formFieldRepository;
    private final EventRepository eventRepository;

    public FormFieldService(FormFieldRepository formFieldRepository, EventRepository eventRepository) {
        this.formFieldRepository = formFieldRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<FormFieldResponse> getFieldsByEvent(UUID eventId) {
        return formFieldRepository.findByEventIdOrderByDisplayOrderAsc(eventId)
                .stream()
                .map(FormFieldResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public FormFieldResponse addField(UUID eventId, FormFieldRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        validateFieldOptions(request.getFieldType(), request.getOptions());

        List<FormField> existingFields = formFieldRepository.findByEventIdOrderByDisplayOrderAsc(eventId);
        int nextOrder = existingFields.isEmpty() ? 0 : existingFields.get(existingFields.size() - 1).getDisplayOrder() + 1;

        FormField field = new FormField();
        field.setEvent(event);
        field.setFieldKey(generateFieldKey());
        field.setLabel(request.getLabel());
        field.setFieldType(request.getFieldType());
        field.setRequired(request.getRequired());
        field.setIsUnique(request.getIsUnique());
        field.setDisplayOrder(nextOrder);
        field.setOptions(request.getOptions());
        field.setValidationRules(request.getValidationRules());

        FormField saved = formFieldRepository.save(field);
        return FormFieldResponse.fromEntity(saved);
    }

    @Transactional
    public FormFieldResponse updateField(UUID fieldId, FormFieldRequest request) {
        FormField field = formFieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Form field not found"));

        validateFieldOptions(request.getFieldType(), request.getOptions());

        field.setLabel(request.getLabel());
        field.setFieldType(request.getFieldType());
        field.setRequired(request.getRequired());
        field.setIsUnique(request.getIsUnique());
        field.setOptions(request.getOptions());
        field.setValidationRules(request.getValidationRules());

        FormField saved = formFieldRepository.save(field);
        return FormFieldResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteField(UUID fieldId) {
        if (!formFieldRepository.existsById(fieldId)) {
            throw new ResourceNotFoundException("Form field not found");
        }
        formFieldRepository.deleteById(fieldId);
    }

    @Transactional
    public void reorderFields(UUID eventId, FormFieldReorderRequest request) {
        List<FormField> fields = formFieldRepository.findByEventIdOrderByDisplayOrderAsc(eventId);
        List<UUID> orderIds = request.getFieldIds();

        for (FormField f : fields) {
            int newIdx = orderIds.indexOf(f.getId());
            if (newIdx != -1) {
                f.setDisplayOrder(newIdx);
                formFieldRepository.save(f);
            }
        }
    }

    private void validateFieldOptions(FieldType type, List<String> options) {
        if ((type == FieldType.DROPDOWN || type == FieldType.RADIO || type == FieldType.CHECKBOX)) {
            if (options == null || options.isEmpty()) {
                throw new IllegalArgumentException("Options are required for dropdown, radio, and checkbox fields");
            }
        }
    }

    private String generateFieldKey() {
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return "field_" + sb.toString();
    }
}
