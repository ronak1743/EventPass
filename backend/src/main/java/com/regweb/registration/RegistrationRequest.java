package com.regweb.registration;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class RegistrationRequest {

    @NotNull(message = "Form data is required")
    private Map<String, Object> formData;

    public Map<String, Object> getFormData() {
        return formData;
    }

    public void setFormData(Map<String, Object> formData) {
        this.formData = formData;
    }
}
