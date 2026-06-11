package com.codecollab.service;

import com.codecollab.model.Room;
import com.codecollab.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.List;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int ROOM_ID_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();
    
    // Generate unique room ID
    private String generateRoomId() {
        StringBuilder sb = new StringBuilder(ROOM_ID_LENGTH);
        for (int i = 0; i < ROOM_ID_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
    
    // Create new room with unique ID
    public Room createRoom(String roomName, String ownerEmail, String language) {
        String roomId;
        do {
            roomId = generateRoomId();
        } while (roomRepository.existsByRoomId(roomId));
        
        Room room = new Room(roomId, roomName, ownerEmail);
        if (language != null && !language.isEmpty()) {
            room.setLanguage(language);
        }
        
        return roomRepository.save(room);
    }
    
    // Get room by roomId
    public Room getRoom(String roomId) {
        return roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
    }
    
    // Join existing room
    public Room joinRoom(String roomId, String email) {
        Room room = getRoom(roomId);
        
        if (!room.isActive()) {
            throw new RuntimeException("Room is no longer active");
        }
        
        room.addParticipant(email);
        return roomRepository.save(room);
    }
    
    // Leave room
    public Room leaveRoom(String roomId, String email) {
        Room room = getRoom(roomId);
        room.removeParticipant(email);
        return roomRepository.save(room);
    }
    
    // Update code content
    public Room updateCode(String roomId, String codeContent) {
        Room room = getRoom(roomId);
        room.setCodeContent(codeContent);
        return roomRepository.save(room);
    }
    
    // Update language
    public Room updateLanguage(String roomId, String language) {
        Room room = getRoom(roomId);
        room.setLanguage(language);
        return roomRepository.save(room);
    }
    
    // Get all rooms for a user (owned + joined)
    public List<Room> getUserRooms(String email) {
        return roomRepository.findByParticipantsContaining(email);
    }
    
    // Get rooms owned by user
    public List<Room> getOwnedRooms(String email) {
        return roomRepository.findByOwnerEmail(email);
    }
    
    // Delete room (owner only)
    public void deleteRoom(String roomId, String ownerEmail) {
        Room room = getRoom(roomId);
        if (!room.getOwnerEmail().equals(ownerEmail)) {
            throw new RuntimeException("Only room owner can delete the room");
        }
        room.setActive(false);
        roomRepository.save(room);
    }
}