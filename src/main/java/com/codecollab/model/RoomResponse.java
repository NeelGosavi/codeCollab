package com.codecollab.model;

import java.util.List;

public class RoomResponse {
    private String roomId;
    private String roomName;
    private String ownerEmail;
    private List<String> participants;
    private String codeContent;
    private String language;
    private String createdAt;
    private int participantCount;
    private boolean isOwner;
    
    public RoomResponse(Room room, String currentUserEmail) {
        this.roomId = room.getRoomId();
        this.roomName = room.getRoomName();
        this.ownerEmail = room.getOwnerEmail();
        this.participants = room.getParticipants();
        this.codeContent = room.getCodeContent();
        this.language = room.getLanguage();
        this.createdAt = room.getCreatedAt();
        this.participantCount = room.getParticipantCount();
        this.isOwner = room.getOwnerEmail().equals(currentUserEmail);
    }
    
    // Getters
    public String getRoomId() { return roomId; }
    public String getRoomName() { return roomName; }
    public String getOwnerEmail() { return ownerEmail; }
    public List<String> getParticipants() { return participants; }
    public String getCodeContent() { return codeContent; }
    public String getLanguage() { return language; }
    public String getCreatedAt() { return createdAt; }
    public int getParticipantCount() { return participantCount; }
    public boolean isOwner() { return isOwner; }
}