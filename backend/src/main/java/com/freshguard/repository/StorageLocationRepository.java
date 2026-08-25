package com.freshguard.repository;

import com.freshguard.entity.StorageLocation;
import com.freshguard.enums.StorageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StorageLocationRepository extends JpaRepository<StorageLocation, Long> {
    List<StorageLocation> findByUserId(Long userId);
    Optional<StorageLocation> findByUserIdAndName(Long userId, StorageType name);
}
