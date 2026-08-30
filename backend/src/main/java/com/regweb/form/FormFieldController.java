package com.regweb.form;

import com.regweb.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events/{eventId}/fields")
public class FormFieldController {

    private final FormFieldService formFieldService;

    public FormFieldController(FormFieldService formFieldService) {
        this.formFieldService = formFieldService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FormFieldResponse>>> getFields(@PathVariable UUID eventId) {
        List<FormFieldResponse> response = formFieldService.getFieldsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FormFieldResponse>> addField(
            @PathVariable UUID eventId,
            @Valid @RequestBody FormFieldRequest request) {
        FormFieldResponse response = formFieldService.addField(eventId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Field added successfully"));
    }

    @PutMapping("/{fieldId}")
    public ResponseEntity<ApiResponse<FormFieldResponse>> updateField(
            @PathVariable UUID eventId,
            @PathVariable UUID fieldId,
            @Valid @RequestBody FormFieldRequest request) {
        FormFieldResponse response = formFieldService.updateField(fieldId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Field updated successfully"));
    }

    @DeleteMapping("/{fieldId}")
    public ResponseEntity<ApiResponse<Void>> deleteField(
            @PathVariable UUID eventId,
            @PathVariable UUID fieldId) {
        formFieldService.deleteField(fieldId);
        return ResponseEntity.ok(ApiResponse.success(null, "Field deleted successfully"));
    }

    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderFields(
            @PathVariable UUID eventId,
            @Valid @RequestBody FormFieldReorderRequest request) {
        formFieldService.reorderFields(eventId, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Fields reordered successfully"));
    }
}
