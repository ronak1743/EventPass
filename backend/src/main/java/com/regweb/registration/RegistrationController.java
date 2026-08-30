package com.regweb.registration;

import com.regweb.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/events/{slug}/register")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerUser(
            @PathVariable String slug,
            @Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.registerPublicUser(slug, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Registration completed successfully"));
    }
}
