package com.codecollab.config;

import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    @Bean
    public MongoTemplate mongoTemplate() {
        String mongoUri = System.getenv("MONGODB_URI");
        
        System.out.println("========================================");
        System.out.println("🔍 MongoConfig - Reading MONGODB_URI directly:");
        if (mongoUri != null) {
            String masked = mongoUri.replaceAll(":[^:@]+@", ":****@");
            System.out.println("✅ Found: " + masked);
        } else {
            System.err.println("❌ MONGODB_URI environment variable is null!");
        }
        System.out.println("========================================");
        
        if (mongoUri == null || mongoUri.isEmpty()) {
            throw new RuntimeException("MONGODB_URI environment variable is not set!");
        }
        
        return new MongoTemplate(new SimpleMongoClientDatabaseFactory(mongoUri));
    }
}