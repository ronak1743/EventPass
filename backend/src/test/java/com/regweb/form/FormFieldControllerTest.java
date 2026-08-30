package com.regweb.form;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.regweb.common.FieldType;
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
import java.util.Collections;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FormFieldControllerTest {

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
        event.setTitle("Dynamic Testing Event");
        event.setSlug("dynamic-test-" + UUID.randomUUID().toString().substring(0, 6));
        event.setStatus(EventStatus.DRAFT);
        event.setTotalCapacity(50);
        Event saved = eventRepository.save(event);
        eventId = saved.getId();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddTextField() throws Exception {
        FormFieldRequest request = new FormFieldRequest();
        request.setLabel("Full Name");
        request.setFieldType(FieldType.TEXT);
        request.setRequired(true);

        mockMvc.perform(post("/api/admin/events/" + eventId + "/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.label").value("Full Name"))
                .andExpect(jsonPath("$.data.fieldKey").isNotEmpty());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddDropdownFieldFailsWithoutOptions() throws Exception {
        FormFieldRequest request = new FormFieldRequest();
        request.setLabel("Choose Session");
        request.setFieldType(FieldType.DROPDOWN);
        request.setRequired(true);
        request.setOptions(Collections.emptyList());

        mockMvc.perform(post("/api/admin/events/" + eventId + "/fields")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
