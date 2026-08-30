package com.regweb.event;

import com.regweb.form.FormFieldResponse;
import java.util.List;

public class PublicEventResponse {
    private EventResponse event;
    private List<FormFieldResponse> fields;
    private boolean registrationOpen;
    private String closedReason;

    public PublicEventResponse(EventResponse event, List<FormFieldResponse> fields) {
        this.event = event;
        this.fields = fields;
        this.registrationOpen = true;
        this.closedReason = null;
    }

    public PublicEventResponse(EventResponse event, List<FormFieldResponse> fields, boolean registrationOpen, String closedReason) {
        this.event = event;
        this.fields = fields;
        this.registrationOpen = registrationOpen;
        this.closedReason = closedReason;
    }

    public EventResponse getEvent() { return event; }
    public void setEvent(EventResponse event) { this.event = event; }

    public List<FormFieldResponse> getFields() { return fields; }
    public void setFields(List<FormFieldResponse> fields) { this.fields = fields; }

    public boolean isRegistrationOpen() { return registrationOpen; }
    public void setRegistrationOpen(boolean registrationOpen) { this.registrationOpen = registrationOpen; }

    public String getClosedReason() { return closedReason; }
    public void setClosedReason(String closedReason) { this.closedReason = closedReason; }
}
