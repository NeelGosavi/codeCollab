package com.codecollab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = "com.codecollab")
@EnableMongoRepositories(basePackages = "com.codecollab.repository")
public class CodecollabApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodecollabApplication.class, args);
    }
}