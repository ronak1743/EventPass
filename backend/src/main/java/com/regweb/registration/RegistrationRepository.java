package com.regweb.registration;

import com.regweb.common.RegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

    Optional<Registration> findByTokenAndDeletedAtIsNull(String token);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.deletedAt IS NULL")
    long countActive();

    long countByEventIdAndDeletedAtIsNull(UUID eventId);

    @Query("SELECT r FROM Registration r WHERE r.event.id = :eventId AND r.deletedAt IS NULL AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:slotId IS NULL OR r.allocatedSlot.id = :slotId) AND " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR r.token = :search OR r.mobile = :search)")
    Page<Registration> searchRegistrations(
        @Param("eventId") UUID eventId,
        @Param("status") RegistrationStatus status,
        @Param("slotId") UUID slotId,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("SELECT r FROM Registration r WHERE r.event.id = :eventId AND r.deletedAt IS NULL AND " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR r.token = :search OR r.mobile = :search)")
    List<Registration> searchCheckInCandidates(@Param("eventId") UUID eventId, @Param("search") String search);

    List<Registration> findByEventIdAndDeletedAtIsNull(UUID eventId);
}
