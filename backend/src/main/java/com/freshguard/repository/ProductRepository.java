package com.freshguard.repository;

import com.freshguard.entity.Product;
import com.freshguard.enums.ExpiryStatus;
import com.freshguard.enums.StorageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByUserId(Long userId, Sort sort);

    Optional<Product> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT p FROM Product p LEFT JOIN p.storageLocation sl " +
           "WHERE p.user.id = :userId " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.category) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:status IS NULL OR p.expiryStatus = :status) " +
           "AND (:location IS NULL OR sl.name = :location)")
    List<Product> searchProducts(@Param("userId") Long userId,
                                 @Param("q") String q,
                                 @Param("status") ExpiryStatus status,
                                 @Param("location") StorageType location,
                                 Sort sort);

    @Query("SELECT " +
           "COUNT(p), " +
           "COALESCE(SUM(CASE WHEN p.expiryStatus = com.freshguard.enums.ExpiryStatus.FRESH THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN p.expiryStatus = com.freshguard.enums.ExpiryStatus.NEAR_EXPIRY THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN p.expiryStatus = com.freshguard.enums.ExpiryStatus.EXPIRED THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN p.expiryDate = :today THEN 1L ELSE 0L END), 0L), " +
           "COUNT(DISTINCT p.category), " +
           "COALESCE(SUM(CASE WHEN sl.name = com.freshguard.enums.StorageType.FRIDGE THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN sl.name = com.freshguard.enums.StorageType.PANTRY THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN sl.name = com.freshguard.enums.StorageType.FREEZER THEN 1L ELSE 0L END), 0L) " +
           "FROM Product p LEFT JOIN p.storageLocation sl " +
           "WHERE p.user.id = :userId")
    List<Object[]> getSummaryMetrics(@Param("userId") Long userId, @Param("today") LocalDate today);

    Page<Product> findAll(Pageable pageable);
}
