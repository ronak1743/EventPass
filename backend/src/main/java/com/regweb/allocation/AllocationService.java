package com.regweb.allocation;

import com.regweb.common.ResourceNotFoundException;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AllocationService {

    private final AllocationConfigRepository allocationConfigRepository;
    private final AllocationSlotRepository allocationSlotRepository;
    private final EventRepository eventRepository;

    public AllocationService(AllocationConfigRepository allocationConfigRepository,
                             AllocationSlotRepository allocationSlotRepository,
                             EventRepository eventRepository) {
        this.allocationConfigRepository = allocationConfigRepository;
        this.allocationSlotRepository = allocationSlotRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public AllocationConfigResponse getAllocationByEvent(UUID eventId) {
        AllocationConfig config = allocationConfigRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation config not found for event"));
        
        List<AllocationSlot> slots = allocationSlotRepository.findByConfigIdOrderByDisplayOrderAsc(config.getId());
        return AllocationConfigResponse.fromEntity(config, slots);
    }

    @Transactional
    public AllocationConfigResponse saveAllocation(UUID eventId, AllocationConfigRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        AllocationConfig config = allocationConfigRepository.findByEventId(eventId)
                .orElseGet(() -> {
                    AllocationConfig c = new AllocationConfig();
                    c.setEvent(event);
                    return c;
                });

        config.setAllocationType(request.getAllocationType());
        config.setSeatsPerUnit(request.getSeatsPerUnit());
        AllocationConfig savedConfig = allocationConfigRepository.save(config);

        // Remove old slots
        List<AllocationSlot> oldSlots = allocationSlotRepository.findByConfigIdOrderByDisplayOrderAsc(savedConfig.getId());
        allocationSlotRepository.deleteAll(oldSlots);

        // Add new slots
        List<AllocationSlot> newSlots = new ArrayList<>();
        if (request.getSlots() != null) {
            for (SlotRequest slotReq : request.getSlots()) {
                AllocationSlot slot = new AllocationSlot();
                slot.setConfig(savedConfig);
                slot.setLabel(slotReq.getLabel());
                slot.setSlotDate(slotReq.getSlotDate());
                slot.setSlotTime(slotReq.getSlotTime());
                slot.setCapacity(slotReq.getCapacity());
                slot.setFilledCount(0);
                slot.setDisplayOrder(slotReq.getDisplayOrder());
                newSlots.add(allocationSlotRepository.save(slot));
            }
        }

        // Enable allocation flag on event
        event.setAllocationEnabled(true);
        eventRepository.save(event);

        return AllocationConfigResponse.fromEntity(savedConfig, newSlots);
    }

    @Transactional
    public SlotResponse updateSlotCapacity(UUID slotId, Integer newCapacity) {
        AllocationSlot slot = allocationSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation slot not found"));

        if (newCapacity < slot.getFilledCount()) {
            throw new IllegalArgumentException("Capacity cannot be less than already registered count (" + slot.getFilledCount() + ")");
        }

        slot.setCapacity(newCapacity);
        AllocationSlot saved = allocationSlotRepository.save(slot);
        return SlotResponse.fromEntity(saved);
    }
}
