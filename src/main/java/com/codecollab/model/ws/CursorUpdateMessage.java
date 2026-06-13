package com.codecollab.model.ws;

public class CursorUpdateMessage {
    private String roomId;
    private String senderEmail;
    private String username;
    private int lineNumber;
    private int columnNumber;
    private long timestamp;
    
    public CursorUpdateMessage() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public CursorUpdateMessage(String roomId, String senderEmail, String username, 
                                int lineNumber, int columnNumber) {
        this.roomId = roomId;
        this.senderEmail = senderEmail;
        this.username = username;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
        this.timestamp = System.currentTimeMillis();
    }
    
    // Getters and Setters
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public int getLineNumber() { return lineNumber; }
    public void setLineNumber(int lineNumber) { this.lineNumber = lineNumber; }
    
    public int getColumnNumber() { return columnNumber; }
    public void setColumnNumber(int columnNumber) { this.columnNumber = columnNumber; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}