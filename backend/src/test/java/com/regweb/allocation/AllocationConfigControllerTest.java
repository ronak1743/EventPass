package com.regweb.allocation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.regweb.common.AllocationType;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.common.EventStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AllocationConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRepository eventRepository;

    private UUID eventId;

    @BeforeEach
    void setUp() {
        Event event = new Event();
        event.setTitle("Allocation Event test");
        event.setSlug("allocation-test-" + UUID.randomUUID().toString().substring(0, 6));
        event.setStatus(EventStatus.DRAFT);
        event.setTotalCapacity(100);
        Event saved = eventRepository.save(event);
        eventId = saved.getId();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testSaveAllocationConfig() throws Exception {
        SlotRequest slot = new SlotRequest();
        slot.setLabel("Day 1 - 29 Aug");
        slot.setCapacity(50);
        slot.setDisplayOrder(0);

        AllocationConfigRequest request = new AllocationConfigRequest();
        request.setAllocationType(AllocationType.DATE);
        request.setSeatsPerUnit(50);
        request.setSlots(Arrays.asList(slot));

        mockMvc.perform(put("/api/admin/events/" + eventId + "/allocation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.allocationType").value("DATE"))
                .andExpect(jsonPath("$.data.slots[0].label").value("Day 1 - 29 Aug"))
                .andExpect(jsonPath("$.data.slots[0].capacity").value(50));
    }
}
