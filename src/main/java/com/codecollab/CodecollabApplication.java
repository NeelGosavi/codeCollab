package com.codecollab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(exclude = {
    MongoAutoConfiguration.class,
    MongoDataAutoConfiguration.class
})
@EnableMongoRepositories(basePackages = "com.codecollab.repository")
public class CodecollabApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodecollabApplication.class, args);
        System.out.println("========================================");
        System.out.println("🚀 CodeCollab Backend Started!");
        System.out.println("========================================");
    }
}