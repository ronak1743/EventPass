package com.regweb.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class EventUpdateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String location;

    private Instant registrationStart;

    private Instant registrationEnd;

    @NotNull(message = "Capacity is required")
    private Integer totalCapacity;

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
}
