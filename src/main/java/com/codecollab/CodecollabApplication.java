package com.codecollab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(
    scanBasePackages = "com.codecollab",
    exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class
    }
)
@EnableMongoRepositories(basePackages = "com.codecollab.repository")
public class CodecollabApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodecollabApplication.class, args);
        System.out.println("========================================");
        System.out.println("🚀 CodeCollab Backend Started!");
        System.out.println("========================================");
    }
}