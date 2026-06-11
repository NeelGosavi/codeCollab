package com.codecollab.model;

public class AuthResponse {
    private String token;
    private String message;
    
    // Default constructor
    public AuthResponse() {}
    
    // Constructor with fields
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
    
    // Getters
    public String getToken() { return token; }
    public String getMessage() { return message; }
    
    // Setters
    public void setToken(String token) { this.token = token; }
    public void setMessage(String message) { this.message = message; }
}