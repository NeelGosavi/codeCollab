package com.codecollab.model.ws;

public class CodeUpdateMessage {
    private String roomId;
    private String codeContent;
    private String senderEmail;
    private long timestamp;
    
    public CodeUpdateMessage() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public CodeUpdateMessage(String roomId, String codeContent, String senderEmail) {
        this.roomId = roomId;
        this.codeContent = codeContent;
        this.senderEmail = senderEmail;
        this.timestamp = System.currentTimeMillis();
    }
    
    // Getters and Setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    
    public String getCodeContent() { return codeContent; }
    public void setCodeContent(String codeContent) { this.codeContent = codeContent; }
    
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}