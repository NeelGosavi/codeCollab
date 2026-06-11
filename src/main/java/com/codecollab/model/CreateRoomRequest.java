package com.codecollab.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateRoomRequest {
    
    @NotBlank(message = "Room name is required")
    @Size(min = 1, max = 50, message = "Room name must be between 1 and 50 characters")
    private String roomName;
    
    @Pattern(regexp = "^(java|python|javascript)$", 
             message = "Language must be java, python, or javascript")
    private String language = "java";
    
    // Constructors
    public CreateRoomRequest() {}
    
    public CreateRoomRequest(String roomName, String language) {
        this.roomName = roomName;
        this.language = language;
    }
    
    // Getters
    public String getRoomName() { return roomName; }
    public String getLanguage() { return language; }
    
    // Setters
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public void setLanguage(String language) { this.language = language; }
}