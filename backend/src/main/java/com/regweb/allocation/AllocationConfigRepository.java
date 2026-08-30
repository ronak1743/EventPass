package com.regweb.allocation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AllocationConfigRepository extends JpaRepository<AllocationConfig, UUID> {
    Optional<AllocationConfig> findByEventId(UUID eventId);
}
