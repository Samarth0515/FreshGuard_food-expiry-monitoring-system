package com.freshguard.repository;

import com.freshguard.entity.BarcodeCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BarcodeCatalogRepository extends JpaRepository<BarcodeCatalog, Long> {
    Optional<BarcodeCatalog> findByBarcode(String barcode);
}
