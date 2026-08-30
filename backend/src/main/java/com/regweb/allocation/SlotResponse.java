package com.regweb.allocation;

import java.time.LocalDate;
import java.util.UUID;

public class SlotResponse {
    private UUID id;
    private String label;
    private LocalDate slotDate;
    private String slotTime;
    private Integer capacity;
    private Integer filledCount;
    private Integer displayOrder;

    public static SlotResponse fromEntity(AllocationSlot entity) {
        SlotResponse resp = new SlotResponse();
        resp.setId(entity.getId());
        resp.setLabel(entity.getLabel());
        resp.setSlotDate(entity.getSlotDate());
        resp.setSlotTime(entity.getSlotTime());
        resp.setCapacity(entity.getCapacity());
        resp.setFilledCount(entity.getFilledCount());
        resp.setDisplayOrder(entity.getDisplayOrder());
        return resp;
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public String getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(String slotTime) {
        this.slotTime = slotTime;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getFilledCount() {
        return filledCount;
    }

    public void setFilledCount(Integer filledCount) {
        this.filledCount = filledCount;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
