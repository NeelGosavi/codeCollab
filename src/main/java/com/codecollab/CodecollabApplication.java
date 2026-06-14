package com.codecollab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.codecollab")
public class CodecollabApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodecollabApplication.class, args);
    }
}