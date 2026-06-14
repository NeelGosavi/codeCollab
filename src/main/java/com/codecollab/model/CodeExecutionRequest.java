package com.codecollab.model;

public class CodeExecutionRequest {
    private String code;
    private String language;
    private String roomId;
    private String userEmail;
    
    public CodeExecutionRequest() {}
    
    public CodeExecutionRequest(String code, String language, String roomId, String userEmail) {
        this.code = code;
        this.language = language;
        this.roomId = roomId;
        this.userEmail = userEmail;
    }
    
    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}