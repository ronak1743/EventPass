package com.regweb.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final AdminRepository adminRepository;

    @Value("${app.admin.default-username}")
    private String defaultUsername;

    @Value("${app.admin.default-password}")
    private String defaultPassword;

    public AdminSeeder(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername(defaultUsername);
            
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
            admin.setPasswordHash(encoder.encode(defaultPassword));
            admin.setEmail("admin@regweb.app");
            
            adminRepository.save(admin);
            log.info("Default admin account created with username: {}", defaultUsername);
        } else {
            log.info("Admin account already exists. Skipping seeding.");
        }
    }
}
