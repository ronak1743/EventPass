package com.regweb.registration;

import java.time.LocalDate;
import java.util.UUID;

public class RegistrationResponse {
    private UUID id;
    private String token;
    private String slotLabel;
    private LocalDate slotDate;
    private String slotTime;
    private String eventTitle;

    public RegistrationResponse(UUID id, String token, String slotLabel, LocalDate slotDate, String slotTime, String eventTitle) {
        this.id = id;
        this.token = token;
        this.slotLabel = slotLabel;
        this.slotDate = slotDate;
        this.slotTime = slotTime;
        this.eventTitle = eventTitle;
    }

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

    public String getSlotLabel() {
        return slotLabel;
    }

    public void setSlotLabel(String slotLabel) {
        this.slotLabel = slotLabel;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public String getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(String slotTime) {
        this.slotTime = slotTime;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }
}
