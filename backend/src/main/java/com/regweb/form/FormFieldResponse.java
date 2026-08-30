package com.regweb.form;

import com.regweb.common.FieldType;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class FormFieldResponse {
    private UUID id;
    private String fieldKey;
    private String label;
    private FieldType fieldType;
    private Boolean required;
    private Boolean isUnique;
    private Integer displayOrder;
    private List<String> options;
    private Map<String, Object> validationRules;
    private Instant createdAt;

    public static FormFieldResponse fromEntity(FormField entity) {
        FormFieldResponse resp = new FormFieldResponse();
        resp.setId(entity.getId());
        resp.setFieldKey(entity.getFieldKey());
        resp.setLabel(entity.getLabel());
        resp.setFieldType(entity.getFieldType());
        resp.setRequired(entity.getRequired());
        resp.setIsUnique(entity.getIsUnique());
        resp.setDisplayOrder(entity.getDisplayOrder());
        resp.setOptions(entity.getOptions());
        resp.setValidationRules(entity.getValidationRules());
        resp.setCreatedAt(entity.getCreatedAt());
        return resp;
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFieldKey() {
        return fieldKey;
    }

    public void setFieldKey(String fieldKey) {
        this.fieldKey = fieldKey;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public FieldType getFieldType() {
        return fieldType;
    }

    public void setFieldType(FieldType fieldType) {
        this.fieldType = fieldType;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Boolean getIsUnique() {
        return isUnique;
    }

    public void setIsUnique(Boolean isUnique) {
        this.isUnique = isUnique;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Map<String, Object> getValidationRules() {
        return validationRules;
    }

    public void setValidationRules(Map<String, Object> validationRules) {
        this.validationRules = validationRules;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
