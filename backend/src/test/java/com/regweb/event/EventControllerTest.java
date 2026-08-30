package com.regweb.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRepository eventRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateEvent() throws Exception {
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle("Summer Bootcamp 2026");
        request.setDescription("A programming bootcamp");
        request.setLocation("Silicon Valley");
        request.setTotalCapacity(150);
        request.setAllocationEnabled(false);

        mockMvc.perform(post("/api/admin/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Summer Bootcamp 2026"))
                .andExpect(jsonPath("$.data.slug").isNotEmpty())
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllEvents() throws Exception {
        mockMvc.perform(get("/api/admin/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void testGetEventsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/admin/events"))
                .andExpect(status().isUnauthorized());
    }
}
