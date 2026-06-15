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
        this.codeContent = getDefaultCodeForLanguage("java");
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
    
    // Helper method to get default code based on language
    public static String getDefaultCodeForLanguage(String language) {
        switch (language.toLowerCase()) {
            case "java":
                return "// Welcome to CodeCollab! 🚀\n" +
                       "// This is a collaborative Java environment\n\n" +
                       "public class Main {\n" +
                       "    public static void main(String[] args) {\n" +
                       "        System.out.println(\"Hello from CodeCollab!\");\n" +
                       "        System.out.println(\"You're now collaborating in real-time!\");\n" +
                       "        \n" +
                       "        // Try running this code\n" +
                       "        int a = 10;\n" +
                       "        int b = 5;\n" +
                       "        System.out.println(\"Sum: \" + (a + b));\n" +
                       "    }\n" +
                       "}\n";
            
            case "python":
                return "# Welcome to CodeCollab! 🚀\n" +
                       "# This is a collaborative Python environment\n\n" +
                       "print(\"Hello from CodeCollab!\")\n" +
                       "print(\"You're now collaborating in real-time!\")\n\n" +
                       "# Try running this code\n" +
                       "a = 10\n" +
                       "b = 5\n" +
                       "print(f\"Sum: {a + b}\")\n\n" +
                       "# Try editing this code and see it sync with others!\n";
            
            case "javascript":
                return "// Welcome to CodeCollab! 🚀\n" +
                       "// This is a collaborative JavaScript environment\n\n" +
                       "console.log(\"Hello from CodeCollab!\");\n" +
                       "console.log(\"You're now collaborating in real-time!\");\n\n" +
                       "// Try running this code\n" +
                       "let a = 10;\n" +
                       "let b = 5;\n" +
                       "console.log(`Sum: ${a + b}`);\n\n" +
                       "// Try editing this code and see it sync with others!\n";
            
            default:
                return "// Welcome to CodeCollab! 🚀\n// Start coding here...\n";
        }
    }
    
    // Update language and code content together
    public void setLanguage(String language) {
        this.language = language;
        // Update code content to match new language only if it's the default
        if (this.codeContent == null || this.codeContent.contains("Write your code here")) {
            this.codeContent = getDefaultCodeForLanguage(language);
        }
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public String getRoomId() { return roomId; }
    public String getRoomName() { return roomName; }
    public String getOwnerEmail() { return ownerEmail; }
    public List<String> getParticipants() { return participants; }
    public String getCodeContent() { return codeContent; }
    public String getLanguage() { return language; }
    public String getCreatedAt() { return createdAt; }
    public boolean isActive() { return isActive; }
    
    public void setId(String id) { this.id = id; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public void setCodeContent(String codeContent) { this.codeContent = codeContent; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public void setActive(boolean active) { isActive = active; }
    
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