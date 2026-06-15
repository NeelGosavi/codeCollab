package com.codecollab.service;

import com.codecollab.model.Room;
import com.codecollab.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int ROOM_ID_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();
    
    private String generateRoomId() {
        StringBuilder sb = new StringBuilder(ROOM_ID_LENGTH);
        for (int i = 0; i < ROOM_ID_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
    
    public Room createRoom(String roomName, String ownerEmail, String language) {
        String roomId;
        do {
            roomId = generateRoomId();
        } while (roomRepository.existsByRoomId(roomId));
        
        Room room = new Room(roomId, roomName, ownerEmail);
        
        // Set language and default code
        if (language != null && !language.isEmpty()) {
            room.setLanguage(language);
            room.setCodeContent(Room.getDefaultCodeForLanguage(language));
        }
        
        // Initialize participants list
        if (room.getParticipants() == null) {
            room.setParticipants(new ArrayList<>());
        }
        if (!room.getParticipants().contains(ownerEmail)) {
            room.getParticipants().add(ownerEmail);
        }
        
        return roomRepository.save(room);
    }
    
    public Room getRoom(String roomId) {
        return roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
    }
    
    public Room joinRoom(String roomId, String email) {
        Room room = getRoom(roomId);
        
        if (!room.isActive()) {
            throw new RuntimeException("Room is no longer active");
        }
        
        // Initialize participants list if null
        if (room.getParticipants() == null) {
            room.setParticipants(new ArrayList<>());
        }
        
        // Add participant if not already present (allow rejoining)
        if (!room.getParticipants().contains(email)) {
            room.getParticipants().add(email);
            System.out.println("✅ Added " + email + " to room " + roomId + ". Total participants: " + room.getParticipants().size());
        } else {
            System.out.println("ℹ️ " + email + " is already in room " + roomId);
        }
        
        return roomRepository.save(room);
    }
    
    public Room leaveRoom(String roomId, String email) {
        Room room = getRoom(roomId);
        
        if (room.getParticipants() != null) {
            room.getParticipants().remove(email);
            System.out.println("❌ Removed " + email + " from room " + roomId + ". Remaining: " + room.getParticipants().size());
        }
        
        return roomRepository.save(room);
    }
    
    public Room updateCode(String roomId, String codeContent) {
        Room room = getRoom(roomId);
        room.setCodeContent(codeContent);
        return roomRepository.save(room);
    }
    
    public Room updateLanguage(String roomId, String language) {
        Room room = getRoom(roomId);
        room.setLanguage(language);
        return roomRepository.save(room);
    }
    
    public List<Room> getUserRooms(String email) {
        // Get rooms where user is a participant
        List<Room> participantRooms = roomRepository.findByParticipantsContaining(email);
        
        // Get rooms where user is the owner
        List<Room> ownedRooms = roomRepository.findByOwnerEmail(email);
        
        // Combine both lists without duplicates and filter out inactive rooms
        List<Room> allRooms = new ArrayList<>();
        
        for (Room room : participantRooms) {
            if (room.isActive() && !allRooms.contains(room)) {
                allRooms.add(room);
            }
        }
        
        for (Room ownedRoom : ownedRooms) {
            if (ownedRoom.isActive() && !allRooms.contains(ownedRoom)) {
                allRooms.add(ownedRoom);
            }
        }
        
        return allRooms;
    }
    
    public List<Room> getOwnedRooms(String email) {
        return roomRepository.findByOwnerEmail(email);
    }
    
    public void deleteRoom(String roomId, String ownerEmail) {
        System.out.println("Attempting to delete room: " + roomId + " by: " + ownerEmail);
        Room room = getRoom(roomId);
        System.out.println("Found room: " + room.getRoomName() + ", Owner: " + room.getOwnerEmail());
        
        if (!room.getOwnerEmail().equals(ownerEmail)) {
            System.err.println("Unauthorized delete attempt by: " + ownerEmail);
            throw new RuntimeException("Only room owner can delete the room");
        }
        
        roomRepository.delete(room);
        System.out.println("🗑️ Room " + roomId + " permanently deleted by " + ownerEmail);
    }
}