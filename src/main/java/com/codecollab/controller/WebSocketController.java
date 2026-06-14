package com.codecollab.controller;

import com.codecollab.model.Room;
import com.codecollab.model.User;
import com.codecollab.model.ws.*;
import com.codecollab.repository.UserRepository;
import com.codecollab.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/code.update")
    public void handleCodeUpdate(@Payload CodeUpdateMessage message) {
        System.out.println("📝 Code update received for room: " + message.getRoomId());
        
        // Save to database
        roomService.updateCode(message.getRoomId(), message.getCodeContent());
        
        // Broadcast to all subscribers of the room
        messagingTemplate.convertAndSend(
            "/topic/room/" + message.getRoomId() + "/code",
            message
        );
    }

    @MessageMapping("/cursor.update")
    public void handleCursorUpdate(@Payload CursorUpdateMessage message) {
        messagingTemplate.convertAndSend(
            "/topic/room/" + message.getRoomId() + "/cursor",
            message
        );
    }

    @MessageMapping("/typing.start")
    public void handleTypingStart(@Payload TypingMessage message) {
        System.out.println("⌨️ Typing start: " + message.getSenderEmail() + " in room " + message.getRoomId());
        messagingTemplate.convertAndSend(
            "/topic/room/" + message.getRoomId() + "/typing",
            message
        );
    }

    @MessageMapping("/typing.stop")
    public void handleTypingStop(@Payload TypingMessage message) {
        System.out.println("✅ Typing stop: " + message.getSenderEmail());
        messagingTemplate.convertAndSend(
            "/topic/room/" + message.getRoomId() + "/typing",
            message
        );
    }

    @MessageMapping("/room.join")
    public void handleJoinRoom(@Payload ParticipantMessage message) {
        try {
            System.out.println("👋 Join request for room: " + message.getRoomId() + " from " + message.getParticipantEmail());
            
            // FIRST: Add user to room participants in database
            Room room = roomService.joinRoom(message.getRoomId(), message.getParticipantEmail());
            
            // Get user details
            Optional<User> userOpt = userRepository.findByEmail(message.getParticipantEmail());
            String username = userOpt.map(User::getUsername)
                    .orElse(message.getParticipantEmail());
            
            // Get the updated participants list from the room
            List<String> participants = room.getParticipants();
            if (participants == null) {
                participants = new ArrayList<>();
            }
            
            System.out.println("📊 Current participants in room " + message.getRoomId() + ": " + participants);
            
            // Prepare join notification with actual participants list
            ParticipantMessage joinMsg = new ParticipantMessage();
            joinMsg.setRoomId(message.getRoomId());
            joinMsg.setEventType("JOIN");
            joinMsg.setParticipantEmail(message.getParticipantEmail());
            joinMsg.setParticipantName(username);
            joinMsg.setParticipantCount(participants.size());
            joinMsg.setParticipants(participants);
            
            System.out.println("📢 Broadcasting join to room: " + message.getRoomId() + " with " + participants.size() + " participants");
            
            // Broadcast join event to everyone in the room
            messagingTemplate.convertAndSend(
                "/topic/room/" + message.getRoomId() + "/participants",
                joinMsg
            );
            
            // Send current code to the new user
            CodeUpdateMessage codeMsg = new CodeUpdateMessage(
                message.getRoomId(),
                room.getCodeContent(),
                "system"
            );
            
            messagingTemplate.convertAndSend(
                "/topic/room/" + message.getRoomId() + "/code",
                codeMsg
            );
            
            System.out.println("✅ Join processed for room: " + message.getRoomId());
            
        } catch (Exception e) {
            System.err.println("❌ Error handling join room: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/room.leave")
    public void handleLeaveRoom(@Payload ParticipantMessage message) {
        try {
            System.out.println("👋 Leave request for room: " + message.getRoomId() + " from " + message.getParticipantEmail());
            
            // Remove user from room participants in database
            Room room = roomService.leaveRoom(message.getRoomId(), message.getParticipantEmail());
            
            // Get user details
            Optional<User> userOpt = userRepository.findByEmail(message.getParticipantEmail());
            String username = userOpt.map(User::getUsername)
                    .orElse(message.getParticipantEmail());
            
            // Get the updated participants list
            List<String> participants = room.getParticipants();
            if (participants == null) {
                participants = new ArrayList<>();
            }
            
            System.out.println("📊 Remaining participants in room " + message.getRoomId() + ": " + participants);
            
            // Prepare leave notification with updated participants list
            ParticipantMessage leaveMsg = new ParticipantMessage();
            leaveMsg.setRoomId(message.getRoomId());
            leaveMsg.setEventType("LEAVE");
            leaveMsg.setParticipantEmail(message.getParticipantEmail());
            leaveMsg.setParticipantName(username);
            leaveMsg.setParticipantCount(participants.size());
            leaveMsg.setParticipants(participants);
            
            // Broadcast leave event to remaining participants
            messagingTemplate.convertAndSend(
                "/topic/room/" + message.getRoomId() + "/participants",
                leaveMsg
            );
            
            System.out.println("✅ Leave processed for room: " + message.getRoomId());
            
        } catch (Exception e) {
            System.err.println("❌ Error handling leave room: " + e.getMessage());
            e.printStackTrace();
        }
    }
}