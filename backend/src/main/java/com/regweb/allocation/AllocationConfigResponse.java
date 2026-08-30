package com.regweb.allocation;

import com.regweb.common.AllocationType;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class AllocationConfigResponse {
    private UUID id;
    private AllocationType allocationType;
    private Integer seatsPerUnit;
    private List<SlotResponse> slots;

    public static AllocationConfigResponse fromEntity(AllocationConfig entity, List<AllocationSlot> slots) {
        AllocationConfigResponse resp = new AllocationConfigResponse();
        resp.setId(entity.getId());
        resp.setAllocationType(entity.getAllocationType());
        resp.setSeatsPerUnit(entity.getSeatsPerUnit());
        if (slots != null) {
            resp.setSlots(slots.stream().map(SlotResponse::fromEntity).collect(Collectors.toList()));
        }
        return resp;
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public List<SlotResponse> getSlots() {
        return slots;
    }

    public void setSlots(List<SlotResponse> slots) {
        this.slots = slots;
    }
}
