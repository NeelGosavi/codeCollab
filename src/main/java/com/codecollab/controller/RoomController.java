package com.codecollab.controller;

import com.codecollab.model.*;
import com.codecollab.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {
    
    @Autowired
    private RoomService roomService;
    
    @PostMapping("/create")
    public RoomResponse createRoom(@Valid @RequestBody CreateRoomRequest request, 
                                    @RequestHeader("X-User-Email") String email) {
        Room room = roomService.createRoom(request.getRoomName(), email, request.getLanguage());
        return new RoomResponse(room, email);
    }
    
    @GetMapping("/{roomId}")
    public RoomResponse getRoom(@PathVariable String roomId,
                                 @RequestHeader("X-User-Email") String email) {
        Room room = roomService.getRoom(roomId);
        return new RoomResponse(room, email);
    }
    
    @PostMapping("/join")
    public RoomResponse joinRoom(@Valid @RequestBody JoinRoomRequest request,
                                  @RequestHeader("X-User-Email") String email) {
        Room room = roomService.joinRoom(request.getRoomId(), email);
        return new RoomResponse(room, email);
    }
    
    @PostMapping("/{roomId}/leave")
    public String leaveRoom(@PathVariable String roomId,
                            @RequestHeader("X-User-Email") String email) {
        roomService.leaveRoom(roomId, email);
        return "Left room successfully";
    }
    
    @PutMapping("/{roomId}/code")
    public RoomResponse updateCode(@PathVariable String roomId,
                                    @RequestBody String codeContent,
                                    @RequestHeader("X-User-Email") String email) {
        Room room = roomService.updateCode(roomId, codeContent);
        return new RoomResponse(room, email);
    }
    
    @PutMapping("/{roomId}/language")
    public RoomResponse updateLanguage(@PathVariable String roomId,
                                        @RequestBody String language,
                                        @RequestHeader("X-User-Email") String email) {
        Room room = roomService.updateLanguage(roomId, language);
        return new RoomResponse(room, email);
    }
    
    @GetMapping("/my-rooms")
    public List<RoomResponse> getMyRooms(@RequestHeader("X-User-Email") String email) {
        return roomService.getUserRooms(email).stream()
                .map(room -> new RoomResponse(room, email))
                .collect(Collectors.toList());
    }
    
    @DeleteMapping("/{roomId}")
    public String deleteRoom(@PathVariable String roomId,
                              @RequestHeader("X-User-Email") String email) {
        roomService.deleteRoom(roomId, email);
        return "Room deleted successfully";
    }
}