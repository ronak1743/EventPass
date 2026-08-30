package com.regweb.registration;

import com.regweb.common.RegistrationStatus;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class AdminRegistrationResponse {
    private UUID id;
    private String token;
    private Map<String, Object> formData;
    private String slotLabel;
    private UUID slotId;
    private RegistrationStatus status;
    private Boolean checkedIn;
    private Instant checkedInAt;
    private String email;
    private String mobile;
    private String name;
    private Instant createdAt;

    public static AdminRegistrationResponse fromEntity(Registration entity) {
        AdminRegistrationResponse resp = new AdminRegistrationResponse();
        resp.setId(entity.getId());
        resp.setToken(entity.getToken());
        resp.setFormData(entity.getFormData());
        if (entity.getAllocatedSlot() != null) {
            resp.setSlotLabel(entity.getAllocatedSlot().getLabel());
            resp.setSlotId(entity.getAllocatedSlot().getId());
        }
        resp.setStatus(entity.getStatus());
        resp.setCheckedIn(entity.getCheckedIn());
        resp.setCheckedInAt(entity.getCheckedInAt());
        resp.setEmail(entity.getEmail());
        resp.setMobile(entity.getMobile());
        resp.setName(entity.getName());
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, Object> getFormData() {
        return formData;
    }

    public void setFormData(Map<String, Object> formData) {
        this.formData = formData;
    }

    public String getSlotLabel() {
        return slotLabel;
    }

    public void setSlotLabel(String slotLabel) {
        this.slotLabel = slotLabel;
    }

    public UUID getSlotId() {
        return slotId;
    }

    public void setSlotId(UUID slotId) {
        this.slotId = slotId;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public Boolean getCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(Boolean checkedIn) {
        this.checkedIn = checkedIn;
    }

    public Instant getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(Instant checkedInAt) {
        this.checkedInAt = checkedInAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
