package com.freshguard.config;

import com.freshguard.entity.StorageLocation;
import com.freshguard.entity.User;
import com.freshguard.enums.StorageType;
import com.freshguard.enums.UserType;
import com.freshguard.repository.StorageLocationRepository;
import com.freshguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StorageLocationRepository storageLocationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${freshguard.admin.default-password:Admin@123}")
    private String adminDefaultPassword;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByMemberId("admin")) {
            log.info("Initializing default administrator account (admin)...");
            User admin = User.builder()
                    .name("System Administrator")
                    .memberId("admin")
                    .passwordHash(passwordEncoder.encode(adminDefaultPassword))
                    .userType(UserType.ADMIN)
                    .build();

            admin = userRepository.save(admin);

            List<StorageLocation> defaultLocations = List.of(
                    StorageLocation.builder().user(admin).name(StorageType.FRIDGE).description("Admin Fridge").build(),
                    StorageLocation.builder().user(admin).name(StorageType.PANTRY).description("Admin Pantry").build(),
                    StorageLocation.builder().user(admin).name(StorageType.FREEZER).description("Admin Freezer").build()
            );
            storageLocationRepository.saveAll(defaultLocations);
            log.info("Default administrator account created successfully.");
        }
    }
}
