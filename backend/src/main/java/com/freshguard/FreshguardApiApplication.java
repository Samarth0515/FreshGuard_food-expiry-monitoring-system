package com.freshguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FreshguardApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(FreshguardApiApplication.class, args);
    }
}
