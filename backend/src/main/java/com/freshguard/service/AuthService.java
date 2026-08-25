package com.freshguard.service;

import com.freshguard.dto.request.ChangePasswordRequest;
import com.freshguard.dto.request.LoginRequest;
import com.freshguard.dto.request.SignUpRequest;
import com.freshguard.dto.response.ApiResponse;
import com.freshguard.dto.response.AuthResponse;
import com.freshguard.dto.response.UserDto;
import com.freshguard.entity.StorageLocation;
import com.freshguard.entity.User;
import com.freshguard.enums.StorageType;
import com.freshguard.exception.DuplicateMemberIdException;
import com.freshguard.exception.InvalidCredentialsException;
import com.freshguard.exception.ResourceNotFoundException;
import com.freshguard.repository.StorageLocationRepository;
import com.freshguard.repository.UserRepository;
import com.freshguard.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StorageLocationRepository storageLocationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        String memberId = request.getMemberId().trim();
        if (userRepository.existsByMemberId(memberId)) {
            throw new DuplicateMemberIdException("Member ID '" + memberId + "' is already registered");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .memberId(memberId)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .userType(request.getUserType())
                .build();

        user = userRepository.save(user);

        // Create default storage locations: FRIDGE, PANTRY, FREEZER
        List<StorageLocation> defaultLocations = List.of(
                StorageLocation.builder().user(user).name(StorageType.FRIDGE).description("Main Refrigerator").build(),
                StorageLocation.builder().user(user).name(StorageType.PANTRY).description("Kitchen Pantry & Cupboards").build(),
                StorageLocation.builder().user(user).name(StorageType.FREEZER).description("Deep Freezer").build()
        );
        storageLocationRepository.saveAll(defaultLocations);

        String token = jwtUtil.generateToken(user.getId(), user.getMemberId(), user.getUserType().name());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .memberId(user.getMemberId())
                        .userType(user.getUserType())
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String memberId = request.getMemberId().trim();
        User user = userRepository.findByMemberId(memberId)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Member ID or Password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid Member ID or Password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getMemberId(), user.getUserType().name());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .memberId(user.getMemberId())
                        .userType(user.getUserType())
                        .build())
                .build();
    }

    @Transactional
    public ApiResponse changePassword(Long currentUserId, ChangePasswordRequest request) {
        String memberId = request.getMemberId().trim();
        User user = userRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with member ID: " + memberId));

        if (currentUserId != null && !user.getId().equals(currentUserId)) {
            throw new InvalidCredentialsException("You can only change password for your own account");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.success("Password updated successfully");
    }
}
