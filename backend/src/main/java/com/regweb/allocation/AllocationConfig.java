package com.regweb.allocation;

import com.regweb.common.AllocationType;
import com.regweb.common.BaseEntity;
import com.regweb.event.Event;
import jakarta.persistence.*;

@Entity
@Table(name = "allocation_configs")
public class AllocationConfig extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false, unique = true)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(name = "allocation_type", nullable = false)
    private AllocationType allocationType;

    @Column(name = "seats_per_unit", nullable = false)
    private Integer seatsPerUnit = 0;

    // Getters and Setters

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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
}
