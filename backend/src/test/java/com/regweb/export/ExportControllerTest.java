package com.regweb.export;

import com.regweb.common.EventStatus;
import com.regweb.event.Event;
import com.regweb.event.EventRepository;
import com.regweb.form.FormFieldRepository;
import com.regweb.allocation.AllocationConfigRepository;
import com.regweb.allocation.AllocationSlotRepository;
import com.regweb.registration.RegistrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExportControllerTest {

    @Autowired
    private MockMvc mockMvc;

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

    @BeforeEach
    void setUp() {
        registrationRepository.deleteAll();
        formFieldRepository.deleteAll();
        allocationSlotRepository.deleteAll();
        allocationConfigRepository.deleteAll();
        eventRepository.deleteAll();
        
        Event event = new Event();
        event.setTitle("Export test Event");
        event.setSlug("export-test-" + UUID.randomUUID().toString().substring(0, 6));
        event.setStatus(EventStatus.PUBLISHED);
        event.setTotalCapacity(10);
        Event saved = eventRepository.save(event);
        eventId = saved.getId();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testExportCsv() throws Exception {
        mockMvc.perform(get("/api/admin/events/" + eventId + "/export/csv"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=registrations-" + eventId + ".csv"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testExportPdf() throws Exception {
        mockMvc.perform(get("/api/admin/events/" + eventId + "/export/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=registrations-" + eventId + ".pdf"));
    }
}
