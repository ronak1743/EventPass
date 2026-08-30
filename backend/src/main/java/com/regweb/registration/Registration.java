package com.regweb.registration;

import com.regweb.allocation.AllocationSlot;
import com.regweb.common.BaseEntity;
import com.regweb.common.RegistrationStatus;
import com.regweb.event.Event;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "registrations", indexes = {
    @Index(name = "idx_registrations_event_id", columnList = "event_id"),
    @Index(name = "idx_registrations_token", columnList = "token"),
    @Index(name = "idx_registrations_email", columnList = "email"),
    @Index(name = "idx_registrations_mobile", columnList = "mobile"),
    @Index(name = "idx_registrations_name", columnList = "name")
})
public class Registration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false, unique = true)
    private String token;

    @Type(JsonType.class)
    @Column(name = "form_data", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> formData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocated_slot_id")
    private AllocationSlot allocatedSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    @Column(name = "checked_in", nullable = false)
    private Boolean checkedIn = false;

    @Column(name = "checked_in_at")
    private Instant checkedInAt;

    private String email;

    private String mobile;

    private String name;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // Getters and Setters

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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

    public AllocationSlot getAllocatedSlot() {
        return allocatedSlot;
    }

    public void setAllocatedSlot(AllocationSlot allocatedSlot) {
        this.allocatedSlot = allocatedSlot;
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

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}
