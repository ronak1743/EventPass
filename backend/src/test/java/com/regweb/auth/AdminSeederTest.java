package com.regweb.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AdminSeederTest {

    @Autowired
    private AdminRepository adminRepository;

    @Test
    void testAdminSeeded() {
        Optional<Admin> adminOpt = adminRepository.findByUsername("admin");
        assertTrue(adminOpt.isPresent());
        
        Admin admin = adminOpt.get();
        assertEquals("admin@regweb.app", admin.getEmail());
        
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        assertTrue(encoder.matches("admin123", admin.getPasswordHash()));
    }
}
