package com.codecollab.repository;

import com.codecollab.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {
    Optional<Room> findByRoomId(String roomId);
    List<Room> findByOwnerEmail(String ownerEmail);
    List<Room> findByParticipantsContaining(String email);
    boolean existsByRoomId(String roomId);
}