package com.regweb.allocation;

import com.regweb.common.AllocationType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class AllocationConfigRequest {

    @NotNull(message = "Allocation type is required")
    private AllocationType allocationType;

    private Integer seatsPerUnit = 0;

    @Valid
    private List<SlotRequest> slots;

    // Getters and Setters

    public AllocationType getAllocationType() {
        return allocationType;
    }

    public void setAllocationType(AllocationType allocationType) {
        this.allocationType = allocationType;
    }

    public Integer getSeatsPerUnit() {
        return seatsPerUnit;
    }

    public void setSeatsPerUnit(Integer seatsPerUnit) {
        this.seatsPerUnit = seatsPerUnit;
    }

    public List<SlotRequest> getSlots() {
        return slots;
    }

    public void setSlots(List<SlotRequest> slots) {
        this.slots = slots;
    }
}
