package com.codecollab.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    
    private String roomId;
    private String roomName;
    private String ownerEmail;
    private List<String> participants;
    private String codeContent;
    private String language;
    private String createdAt;
    private boolean isActive;
    
    public Room() {
        this.participants = new ArrayList<>();
        this.createdAt = Instant.now().toString();
        this.isActive = true;
        this.language = "java";
        this.codeContent = "// Write your code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}";
    }
    
    public Room(String roomId, String roomName, String ownerEmail) {
        this();
        this.roomId = roomId;
        this.roomName = roomName;
        this.ownerEmail = ownerEmail;
        if (this.participants == null) {
            this.participants = new ArrayList<>();
        }
        this.participants.add(ownerEmail);
    }
    
    // Getters
    public String getId() { return id; }
    public String getRoomId() { return roomId; }
    public String getRoomName() { return roomName; }
    public String getOwnerEmail() { return ownerEmail; }
    public List<String> getParticipants() { return participants; }
    public String getCodeContent() { return codeContent; }
    public String getLanguage() { return language; }
    public String getCreatedAt() { return createdAt; }
    public boolean isActive() { return isActive; }
    
    // Setters
    public void setId(String id) { this.id = id; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public void setCodeContent(String codeContent) { this.codeContent = codeContent; }
    public void setLanguage(String language) { this.language = language; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public void setActive(boolean active) { isActive = active; }
    
    // Helper methods
    public void addParticipant(String email) {
        if (participants == null) {
            participants = new ArrayList<>();
        }
        if (!participants.contains(email)) {
            participants.add(email);
        }
    }
    
    public void removeParticipant(String email) {
        if (participants != null) {
            participants.remove(email);
        }
    }
    
    public int getParticipantCount() {
        return participants == null ? 0 : participants.size();
    }
}