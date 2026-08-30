package com.regweb.event;

import com.regweb.common.ApiResponse;
import com.regweb.common.EventStatus;
import com.regweb.common.PagedResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<EventResponse>>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Page<EventResponse> eventPage = eventService.getAllEvents(PageRequest.of(page, size, sort));

        PagedResponse<EventResponse> response = new PagedResponse<>(
                eventPage.getContent(),
                eventPage.getNumber(),
                eventPage.getSize(),
                eventPage.getTotalElements(),
                eventPage.getTotalPages()
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventCreateRequest request) {
        EventResponse response = eventService.createEvent(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Event created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable UUID id) {
        EventResponse response = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventUpdateRequest request) {
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Event updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EventResponse>> changeStatus(
            @PathVariable UUID id,
            @RequestParam EventStatus status) {
        EventResponse response = eventService.changeStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(response, "Event status updated successfully"));
    }

    @PatchMapping("/{id}/capacity")
    public ResponseEntity<ApiResponse<EventResponse>> updateCapacity(
            @PathVariable UUID id,
            @RequestParam Integer capacity) {
        EventResponse response = eventService.updateCapacity(id, capacity);
        return ResponseEntity.ok(ApiResponse.success(response, "Event capacity updated successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<EventStatsResponse>> getStats() {
        EventStatsResponse response = eventService.getStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
