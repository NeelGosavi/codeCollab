package com.codecollab.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SimpleController {

    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Server is running!");
        response.put("timestamp", java.time.Instant.now().toString());
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "CodeCollab Backend");
        return response;
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}