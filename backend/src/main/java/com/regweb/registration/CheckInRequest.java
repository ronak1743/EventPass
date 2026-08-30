package com.regweb.registration;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CheckInRequest {

    @NotNull(message = "Registration ID is required")
    private UUID registrationId;

    public UUID getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(UUID registrationId) {
        this.registrationId = registrationId;
    }
}
