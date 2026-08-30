package com.regweb.registration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.regweb.common.EventStatus;
import com.regweb.common.RegistrationStatus;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.form.FormFieldRepository;
import com.regweb.allocation.AllocationConfigRepository;
import com.regweb.allocation.AllocationSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminRegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private FormFieldRepository formFieldRepository;

    @Autowired
    private AllocationConfigRepository allocationConfigRepository;

    @Autowired
    private AllocationSlotRepository allocationSlotRepository;

    private UUID eventId;
    private UUID registrationId;

    @BeforeEach
    void setUp() {
        registrationRepository.deleteAll();
        formFieldRepository.deleteAll();
        allocationSlotRepository.deleteAll();
        allocationConfigRepository.deleteAll();
        eventRepository.deleteAll();

        Event event = new Event();
        event.setTitle("Management test event");
        event.setSlug("manage-test-" + UUID.randomUUID().toString().substring(0, 6));
        event.setStatus(EventStatus.PUBLISHED);
        event.setTotalCapacity(100);
        event.setRegisteredCount(1);
        Event savedEvent = eventRepository.save(event);
        eventId = savedEvent.getId();

        Registration reg = new Registration();
        reg.setEvent(savedEvent);
        reg.setToken("TOKEN123");
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Bob Smith");
        reg.setFormData(data);
        reg.setName("Bob Smith");
        reg.setStatus(RegistrationStatus.REGISTERED);
        reg.setCheckedIn(false);
        Registration savedReg = registrationRepository.save(reg);
        registrationId = savedReg.getId();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCheckInAttendee() throws Exception {
        CheckInRequest request = new CheckInRequest();
        request.setRegistrationId(registrationId);

        mockMvc.perform(post("/api/admin/events/" + eventId + "/checkin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.checkedIn").value(true))
                .andExpect(jsonPath("$.data.status").value("CHECKED_IN"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteRegistrationDecrementsCount() throws Exception {
        mockMvc.perform(delete("/api/admin/events/" + eventId + "/registrations/" + registrationId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Check registered count decremented
        Event event = eventRepository.findById(eventId).get();
        assertEquals(0, event.getRegisteredCount());
    }
}
