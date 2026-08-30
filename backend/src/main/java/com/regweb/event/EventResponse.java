package com.regweb.event;

import com.regweb.common.EventStatus;
import java.time.Instant;
import java.util.UUID;

public class EventResponse {
    private UUID id;
    private String title;
    private String description;
    private String location;
    private EventStatus status;
    private Instant registrationStart;
    private Instant registrationEnd;
    private Integer totalCapacity;
    private Integer registeredCount;
    private String slug;
    private Boolean allocationEnabled;
    private Instant createdAt;

    public static EventResponse fromEntity(Event entity) {
        EventResponse resp = new EventResponse();
        resp.setId(entity.getId());
        resp.setTitle(entity.getTitle());
        resp.setDescription(entity.getDescription());
        resp.setLocation(entity.getLocation());
        resp.setStatus(entity.getStatus());
        resp.setRegistrationStart(entity.getRegistrationStart());
        resp.setRegistrationEnd(entity.getRegistrationEnd());
        resp.setTotalCapacity(entity.getTotalCapacity());
        resp.setRegisteredCount(entity.getRegisteredCount());
        resp.setSlug(entity.getSlug());
        resp.setAllocationEnabled(entity.getAllocationEnabled());
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Instant getRegistrationStart() {
        return registrationStart;
    }

    public void setRegistrationStart(Instant registrationStart) {
        this.registrationStart = registrationStart;
    }

    public Instant getRegistrationEnd() {
        return registrationEnd;
    }

    public void setRegistrationEnd(Instant registrationEnd) {
        this.registrationEnd = registrationEnd;
    }

    public Integer getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Integer totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public Integer getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(Integer registeredCount) {
        this.registeredCount = registeredCount;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Boolean getAllocationEnabled() {
        return allocationEnabled;
    }

    public void setAllocationEnabled(Boolean allocationEnabled) {
        this.allocationEnabled = allocationEnabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
