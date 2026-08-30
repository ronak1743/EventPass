package com.regweb.event;

import com.regweb.common.ApiResponse;
import com.regweb.common.EventStatus;
import com.regweb.form.FormFieldResponse;
import com.regweb.form.FormFieldService;
import com.regweb.registration.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/events")
public class PublicEventController {

    private final EventService eventService;
    private final FormFieldService formFieldService;
    private final RegistrationService registrationService;

    public PublicEventController(EventService eventService, FormFieldService formFieldService, RegistrationService registrationService) {
        this.eventService = eventService;
        this.formFieldService = formFieldService;
        this.registrationService = registrationService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PublicEventResponse>> getPublicEvent(@PathVariable String slug) {
        EventResponse event = eventService.getEventBySlug(slug);

        // Registration open = admin has explicitly set status to PUBLISHED.
        // Time-window (registrationStart/End) is only enforced at submission time,
        // so the form always renders when status == PUBLISHED regardless of dates.
        boolean registrationOpen = event.getStatus() == EventStatus.PUBLISHED;
        String closedReason = null;

        if (!registrationOpen) {
            closedReason = event.getStatus() == EventStatus.CLOSED
                    ? "Registration for this event has been closed by the organiser."
                    : "This event is not currently accepting registrations.";
        }

        List<FormFieldResponse> fields = registrationOpen
                ? formFieldService.getFieldsByEvent(event.getId())
                : List.of();

        PublicEventResponse response = new PublicEventResponse(event, fields, registrationOpen, closedReason);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{slug}/fields/{fieldKey}/check-unique")
    public ResponseEntity<ApiResponse<Boolean>> checkUniqueAnswer(
            @PathVariable String slug,
            @PathVariable String fieldKey,
            @RequestParam String value) {
        boolean isUnique = registrationService.checkUniqueAnswer(slug, fieldKey, value);
        return ResponseEntity.ok(ApiResponse.success(isUnique, "Unique check completed"));
    }
}
