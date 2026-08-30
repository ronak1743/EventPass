package com.regweb.registration;

import com.regweb.common.CapacityExceededException;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.common.EventStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
class RegistrationConcurrencyTest {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Test
    void testConcurrencyCapacityLimit() throws Exception {
        // Setup event with 50 capacity limit
        Event event = new Event();
        event.setTitle("Concurrency Coding Bootcamp");
        event.setSlug("concurrency-bootcamp-" + UUID.randomUUID().toString().substring(0, 6));
        event.setTotalCapacity(50);
        event.setStatus(EventStatus.PUBLISHED);
        event.setRegisteredCount(0);
        event.setAllocationEnabled(false);
        Event saved = eventRepository.save(event);

        int threadCount = 100;
        ExecutorService executor = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successCounter = new AtomicInteger(0);
        AtomicInteger failureCounter = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    latch.await(); // wait for start signal to run concurrently
                    
                    RegistrationRequest req = new RegistrationRequest();
                    Map<String, Object> data = new HashMap<>();
                    data.put("field_name", "User " + index);
                    req.setFormData(data);

                    registrationService.registerPublicUser(saved.getSlug(), req);
                    successCounter.incrementAndGet();
                } catch (CapacityExceededException e) {
                    failureCounter.incrementAndGet();
                } catch (Exception e) {
                    // unexpected error
                    e.printStackTrace();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        latch.countDown(); // trigger parallel executions
        doneLatch.await(); // wait for all threads to finish
        executor.shutdown();

        // Validate results
        long dbCount = registrationRepository.countByEventIdAndDeletedAtIsNull(saved.getId());
        
        // Assert exactly 50 registrations succeeded, and 50 got CapacityExceededException
        assertEquals(50, successCounter.get(), "Successful registrations should be exactly 50");
        assertEquals(50, failureCounter.get(), "Failure due to capacity should be exactly 50");
        assertEquals(50, dbCount, "DB records should match capacity limit");

        // Verify denormalized counter
        Event updatedEvent = eventRepository.findById(saved.getId()).get();
        assertEquals(50, updatedEvent.getRegisteredCount(), "Denormalized registeredCount should be updated correctly");
    }
}
