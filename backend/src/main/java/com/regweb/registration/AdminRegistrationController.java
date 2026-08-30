package com.regweb.registration;

import com.regweb.common.ApiResponse;
import com.regweb.common.PagedResponse;
import com.regweb.common.RegistrationStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events/{eventId}")
public class AdminRegistrationController {

    private final RegistrationService registrationService;

    public AdminRegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<PagedResponse<AdminRegistrationResponse>>> getRegistrations(
            @PathVariable UUID eventId,
            @RequestParam(required = false) RegistrationStatus status,
            @RequestParam(required = false) UUID slotId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Page<AdminRegistrationResponse> pagedResult = registrationService.searchRegistrations(
                eventId, status, slotId, search, PageRequest.of(page, size, sort)
        );

        PagedResponse<AdminRegistrationResponse> response = new PagedResponse<>(
                pagedResult.getContent(),
                pagedResult.getNumber(),
                pagedResult.getSize(),
                pagedResult.getTotalElements(),
                pagedResult.getTotalPages()
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/registrations/{id}")
    public ResponseEntity<ApiResponse<AdminRegistrationResponse>> getRegistrationDetail(
            @PathVariable UUID eventId,
            @PathVariable UUID id) {
        AdminRegistrationResponse response = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/registrations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRegistration(
            @PathVariable UUID eventId,
            @PathVariable UUID id) {
        registrationService.softDeleteRegistration(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Registration deleted successfully"));
    }

    @GetMapping("/checkin/search")
    public ResponseEntity<ApiResponse<List<AdminRegistrationResponse>>> searchCheckInCandidates(
            @PathVariable UUID eventId,
            @RequestParam String q) {
        List<AdminRegistrationResponse> response = registrationService.searchCheckInCandidates(eventId, q);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/checkin")
    public ResponseEntity<ApiResponse<AdminRegistrationResponse>> checkInAttendee(
            @PathVariable UUID eventId,
            @Valid @RequestBody CheckInRequest request) {
        AdminRegistrationResponse response = registrationService.checkInAttendee(request.getRegistrationId());
        return ResponseEntity.ok(ApiResponse.success(response, "Attendee checked in successfully"));
    }
}
