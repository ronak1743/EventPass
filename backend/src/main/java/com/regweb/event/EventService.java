package com.regweb.event;

import com.regweb.common.EventStatus;
import com.regweb.common.ResourceNotFoundException;
import com.regweb.registration.RegistrationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public EventService(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Transactional
    public EventResponse createEvent(EventCreateRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setRegistrationStart(request.getRegistrationStart());
        event.setRegistrationEnd(request.getRegistrationEnd());
        event.setTotalCapacity(request.getTotalCapacity());
        event.setRegisteredCount(0);
        event.setAllocationEnabled(request.getAllocationEnabled());
        event.setStatus(EventStatus.DRAFT);
        event.setSlug(generateSlug(request.getTitle()));

        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved);
    }

    @Transactional
    public EventResponse updateEvent(UUID id, EventUpdateRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setRegistrationStart(request.getRegistrationStart());
        event.setRegistrationEnd(request.getRegistrationEnd());
        event.setTotalCapacity(request.getTotalCapacity());

        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return EventResponse.fromEntity(event);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventBySlug(String slug) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return EventResponse.fromEntity(event);
    }

    @Transactional
    public EventResponse changeStatus(UUID id, EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(status);
        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved);
    }

    @Transactional
    public EventResponse updateCapacity(UUID id, Integer newCapacity) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (newCapacity < event.getRegisteredCount()) {
            throw new IllegalArgumentException("New capacity cannot be less than registered count");
        }
        event.setTotalCapacity(newCapacity);
        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable).map(EventResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public EventStatsResponse getStats() {
        long totalEvents = eventRepository.count();
        long totalRegistrations = registrationRepository.countActive();
        
        long activeEvents = eventRepository.findAll().stream()
                .filter(e -> e.getStatus() == EventStatus.PUBLISHED)
                .count();

        double totalCapacity = eventRepository.findAll().stream()
                .mapToDouble(Event::getTotalCapacity)
                .sum();

        double capacityUtilization = totalCapacity > 0 
                ? (totalRegistrations / totalCapacity) * 100 
                : 0.0;

        return new EventStatsResponse(totalEvents, totalRegistrations, activeEvents, capacityUtilization);
    }

    private String generateSlug(String title) {
        String base = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .trim()
                .replaceAll("\\s+", "-");
        if (base.isEmpty()) {
            base = "event";
        }
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return base + "-" + sb.toString();
    }
}
