package com.codecollab.model.ws;

import java.util.List;

public class ParticipantMessage {
    private String roomId;
    private String eventType;
    private String participantEmail;
    private String participantName;
    private List<String> participants;
    private int participantCount;
    private long timestamp;
    
    public ParticipantMessage() {
        this.timestamp = System.currentTimeMillis();
    }
    
    // Getters
    public String getRoomId() { return roomId; }
    public String getEventType() { return eventType; }
    public String getParticipantEmail() { return participantEmail; }
    public String getParticipantName() { return participantName; }
    public List<String> getParticipants() { return participants; }
    public int getParticipantCount() { return participantCount; }
    public long getTimestamp() { return timestamp; }
    
    // Setters
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public void setParticipantEmail(String participantEmail) { this.participantEmail = participantEmail; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public void setParticipantCount(int participantCount) { this.participantCount = participantCount; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}