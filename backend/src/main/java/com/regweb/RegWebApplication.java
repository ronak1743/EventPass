package com.regweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RegWebApplication {
    public static void main(String[] args) {
        SpringApplication.run(RegWebApplication.class, args);
    }
}
