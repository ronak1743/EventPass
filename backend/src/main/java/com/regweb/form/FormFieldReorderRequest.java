package com.regweb.form;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class FormFieldReorderRequest {

    @NotNull(message = "Field IDs list is required")
    private List<UUID> fieldIds;

    public List<UUID> getFieldIds() {
        return fieldIds;
    }

    public void setFieldIds(List<UUID> fieldIds) {
        this.fieldIds = fieldIds;
    }
}
