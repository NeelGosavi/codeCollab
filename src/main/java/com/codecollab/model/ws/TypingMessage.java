package com.codecollab.model.ws;

public class TypingMessage {
    private String roomId;
    private String senderEmail;
    private String username;
    private boolean isTyping;
    private long timestamp;
    
    public TypingMessage() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public TypingMessage(String roomId, String senderEmail, String username, boolean isTyping) {
        this.roomId = roomId;
        this.senderEmail = senderEmail;
        this.username = username;
        this.isTyping = isTyping;
        this.timestamp = System.currentTimeMillis();
    }
    
    // Getters and Setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public boolean isTyping() { return isTyping; }
    public void setTyping(boolean typing) { isTyping = typing; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}