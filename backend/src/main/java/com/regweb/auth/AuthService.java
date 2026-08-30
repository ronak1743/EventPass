package com.regweb.auth;

import com.regweb.common.ResourceNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.adminRepository = adminRepository;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(request.getUsername());

        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        return new LoginResponse(jwt, admin.getUsername(), admin.getEmail());
    }

    public AdminResponse getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Not authenticated");
        }
        
        String username = authentication.getName();
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin profile not found"));

        return new AdminResponse(admin.getUsername(), admin.getEmail());
    }
}
