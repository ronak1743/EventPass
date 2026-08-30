package com.regweb.registration;

import com.regweb.allocation.*;
import com.regweb.common.AllocationType;
import com.regweb.common.EventStatus;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
class SlotAllocationConcurrencyTest {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AllocationConfigRepository allocationConfigRepository;

    @Autowired
    private AllocationSlotRepository allocationSlotRepository;

    @Test
    void testSlotAllocationConcurrency() throws Exception {
        // Setup Event
        Event event = new Event();
        event.setTitle("Slot Allocation Concurrency Event");
        event.setSlug("slot-concurrency-" + UUID.randomUUID().toString().substring(0, 6));
        event.setTotalCapacity(150);
        event.setStatus(EventStatus.PUBLISHED);
        event.setRegisteredCount(0);
        event.setAllocationEnabled(true);
        Event savedEvent = eventRepository.save(event);

        // Setup Allocation Config
        AllocationConfig config = new AllocationConfig();
        config.setEvent(savedEvent);
        config.setAllocationType(AllocationType.SLOT);
        config.setSeatsPerUnit(50);
        AllocationConfig savedConfig = allocationConfigRepository.save(config);

        // Setup 3 Slots of capacity 50 each
        AllocationSlot slot1 = new AllocationSlot();
        slot1.setConfig(savedConfig);
        slot1.setLabel("Slot 1");
        slot1.setCapacity(50);
        slot1.setFilledCount(0);
        slot1.setDisplayOrder(0);
        AllocationSlot savedSlot1 = allocationSlotRepository.save(slot1);

        AllocationSlot slot2 = new AllocationSlot();
        slot2.setConfig(savedConfig);
        slot2.setLabel("Slot 2");
        slot2.setCapacity(50);
        slot2.setFilledCount(0);
        slot2.setDisplayOrder(1);
        AllocationSlot savedSlot2 = allocationSlotRepository.save(slot2);

        AllocationSlot slot3 = new AllocationSlot();
        slot3.setConfig(savedConfig);
        slot3.setLabel("Slot 3");
        slot3.setCapacity(50);
        slot3.setFilledCount(0);
        slot3.setDisplayOrder(2);
        AllocationSlot savedSlot3 = allocationSlotRepository.save(slot3);

        int threadCount = 150;
        ExecutorService executor = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successCounter = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    latch.await();
                    
                    RegistrationRequest req = new RegistrationRequest();
                    Map<String, Object> data = new HashMap<>();
                    data.put("field_name", "Slot User " + index);
                    req.setFormData(data);

                    registrationService.registerPublicUser(savedEvent.getSlug(), req);
                    successCounter.incrementAndGet();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        latch.countDown();
        doneLatch.await();
        executor.shutdown();

        // Verify successful registrations count
        assertEquals(150, successCounter.get(), "All 150 registrations should succeed");

        // Verify counts of individual slots are exactly 50
        AllocationSlot updatedSlot1 = allocationSlotRepository.findById(savedSlot1.getId()).get();
        AllocationSlot updatedSlot2 = allocationSlotRepository.findById(savedSlot2.getId()).get();
        AllocationSlot updatedSlot3 = allocationSlotRepository.findById(savedSlot3.getId()).get();

        assertEquals(50, updatedSlot1.getFilledCount(), "Slot 1 should have exactly 50 bookings");
        assertEquals(50, updatedSlot2.getFilledCount(), "Slot 2 should have exactly 50 bookings");
        assertEquals(50, updatedSlot3.getFilledCount(), "Slot 3 should have exactly 50 bookings");
    }
}
