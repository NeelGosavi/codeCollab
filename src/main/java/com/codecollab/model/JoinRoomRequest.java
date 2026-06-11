package com.codecollab.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class JoinRoomRequest {
    
    @NotBlank(message = "Room ID is required")
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Room ID must be 6 uppercase letters or numbers")
    private String roomId;
    
    private String email;  // Will be overridden by header
    
    // Constructors
    public JoinRoomRequest() {}
    
    public JoinRoomRequest(String roomId, String email) {
        this.roomId = roomId;
        this.email = email;
    }
    
    // Getters
    public String getRoomId() { return roomId; }
    public String getEmail() { return email; }
    
    // Setters
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public void setEmail(String email) { this.email = email; }
}