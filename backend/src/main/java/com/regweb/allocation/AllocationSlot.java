package com.regweb.allocation;

import com.regweb.common.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "allocation_slots", indexes = {
    @Index(name = "idx_allocation_slots_config", columnList = "config_id, display_order")
})
public class AllocationSlot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "config_id", nullable = false)
    private AllocationConfig config;

    @Column(nullable = false)
    private String label;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Column(name = "slot_time")
    private String slotTime;

    @Column(nullable = false)
    private Integer capacity = 0;

    @Column(name = "filled_count", nullable = false)
    private Integer filledCount = 0;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    // Getters and Setters

    public AllocationConfig getConfig() {
        return config;
    }

    public void setConfig(AllocationConfig config) {
        this.config = config;
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
