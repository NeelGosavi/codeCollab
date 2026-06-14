package com.codecollab.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupChecker implements CommandLineRunner {

    @Value("${spring.data.mongodb.uri:NOT_SET}")
    private String mongoUri;

    @Override
    public void run(String... args) {
        System.out.println("========================================");
        System.out.println("🔍 ENVIRONMENT VARIABLE CHECK:");
        
        String envUri = System.getenv("MONGODB_URI");
        System.out.println("MONGODB_URI from System.getenv(): " + (envUri != null ? "✅ SET" : "❌ NOT SET"));
        
        if (envUri != null) {
            // Mask password for security
            String masked = envUri.replaceAll(":[^:@]+@", ":****@");
            System.out.println("  Value: " + masked);
        }
        
        System.out.println("spring.data.mongodb.uri from properties: " + 
            (mongoUri != null && !mongoUri.equals("NOT_SET") ? "✅ SET" : "❌ NOT SET"));
        
        if (mongoUri != null && !mongoUri.equals("NOT_SET") && !mongoUri.contains("localhost")) {
            System.out.println("✅ MongoDB URI is correctly configured!");
        } else {
            System.err.println("❌ ERROR: MONGODB_URI environment variable is NOT being read!");
            System.err.println("Please check Render environment variables.");
        }
        System.out.println("========================================");
    }
}