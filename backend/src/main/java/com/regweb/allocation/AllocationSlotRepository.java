package com.regweb.allocation;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AllocationSlotRepository extends JpaRepository<AllocationSlot, UUID> {

    List<AllocationSlot> findByConfigIdOrderByDisplayOrderAsc(UUID configId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM AllocationSlot s WHERE s.config.id = :configId AND s.filledCount < s.capacity ORDER BY s.displayOrder ASC")
    List<AllocationSlot> findAvailableSlotsForUpdate(@Param("configId") UUID configId, Pageable pageable);
}
