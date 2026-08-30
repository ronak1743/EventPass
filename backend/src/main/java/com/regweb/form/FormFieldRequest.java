package com.regweb.form;

import com.regweb.common.FieldType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class FormFieldRequest {

    @NotBlank(message = "Label is required")
    private String label;

    @NotNull(message = "Field type is required")
    private FieldType fieldType;

    private Boolean required = false;

    private Boolean isUnique = false;

    private List<String> options;

    private Map<String, Object> validationRules;

    // Getters and Setters

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
}
