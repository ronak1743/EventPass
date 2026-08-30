package com.regweb.allocation;

import com.regweb.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events/{eventId}/allocation")
public class AllocationConfigController {

    private final AllocationService allocationService;

    public AllocationConfigController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AllocationConfigResponse>> getAllocation(@PathVariable UUID eventId) {
        AllocationConfigResponse response = allocationService.getAllocationByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AllocationConfigResponse>> saveAllocation(
            @PathVariable UUID eventId,
            @Valid @RequestBody AllocationConfigRequest request) {
        AllocationConfigResponse response = allocationService.saveAllocation(eventId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Allocation settings saved successfully"));
    }

    @PatchMapping("/slots/{slotId}/capacity")
    public ResponseEntity<ApiResponse<SlotResponse>> updateSlotCapacity(
            @PathVariable UUID eventId,
            @PathVariable UUID slotId,
            @RequestParam Integer capacity) {
        SlotResponse response = allocationService.updateSlotCapacity(slotId, capacity);
        return ResponseEntity.ok(ApiResponse.success(response, "Slot capacity updated successfully"));
    }
}
