package com.freshguard.repository;

import com.freshguard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMemberId(String memberId);
    boolean existsByMemberId(String memberId);
}
