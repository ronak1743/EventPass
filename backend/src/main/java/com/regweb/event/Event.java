package com.regweb.event;

import com.regweb.common.BaseEntity;
import com.regweb.common.EventStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_events_slug", columnList = "slug"),
    @Index(name = "idx_events_status", columnList = "status")
})
public class Event extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.DRAFT;

    @Column(name = "registration_start")
    private Instant registrationStart;

    @Column(name = "registration_end")
    private Instant registrationEnd;

    @Column(name = "total_capacity", nullable = false)
    private Integer totalCapacity = 0;

    @Column(name = "registered_count", nullable = false)
    private Integer registeredCount = 0;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "allocation_enabled", nullable = false)
    private Boolean allocationEnabled = false;

    // Getters and Setters

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
}
